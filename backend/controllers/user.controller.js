import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
// Import Cloudinary helper functions from the config file
import {
  cloudinaryUpload,
  deleteCloudinaryImage,
  extractPublicId,
} from '../config/cloudinary.config.js';

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await User.find()
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Here are list of users',
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNextPage: page < Math.ceil(totalUsers / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const requestedUserId = req.params.id;
    const currentUserId = req.user.id; // From auth middleware

    // Check if user is accessing their own profile or is an admin
    // Corrected logic: user can view their own profile OR if they are an admin
    if (
      String(requestedUserId) !== String(currentUserId) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own profile.',
      });
    }

    const user = await User.findById(requestedUserId).select(
      '-password -otp -otpExpiry'
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `Profile information for ${user.userName}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const requestedUserId = req.params.id || req.user.id;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    // Check if user is updating their own profile or is an admin
    // Corrected logic: user can update their own profile OR if they are an admin
    if (
      String(requestedUserId) !== String(currentUserId) &&
      currentUserRole !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own profile.',
      });
    }

    const { firstName, lastName, userName } = req.body;

    if (!firstName || !lastName || !userName) {
      return res
        .status(422)
        .json({ success: false, message: 'All fields must be filled' });
    }

    // Check if username is already taken by another user
    const existingUser = await User.findOne({
      userName,
      _id: { $ne: requestedUserId },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Username is already taken' });
    }

    const updateData = { firstName, lastName, userName };

    const user = await User.findByIdAndUpdate(requestedUserId, updateData, {
      new: true,
    }).select('-password -otp -otpExpiry');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload or update a user's profile image
 * @route   PUT /api/users/:id/profile-image
 * @access  Private (User/Admin)
 */
export const updateProfileImage = async (req, res, next) => {
  let newUploadedImageUrl = null; // Variable to store the new Cloudinary URL for cleanup
  try {
    const requestedUserId = req.params.id;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    // Authorization: User can update their own profile image or an admin can update any.
    if (
      String(requestedUserId) !== String(currentUserId) &&
      currentUserRole !== 'admin'
    ) {
      // If unauthorized, and a file was uploaded (now in req.file.buffer),
      // we need to prevent it from being uploaded to Cloudinary.
      // This is handled by the `newUploadedImageUrl` cleanup in the catch block if it gets uploaded before this check.
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own profile image.',
      });
    }

    // Ensure a file was actually uploaded and is available in buffer.
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided for upload.',
      });
    }

    // const user = await User.findById(requestedUserId);
    const user = await User.findById(requestedUserId).select(
      '-password -otp -otpExpiry'
    );

    if (!user) {
      // If user not found, and a new image was uploaded, delete it from Cloudinary.
      // This cleanup is handled in the catch block if `newUploadedImageUrl` is set.
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // 1. If an old profile image exists, delete it from Cloudinary.
    if (user.profileImage) {
      const publicId = extractPublicId(user.profileImage);
      if (publicId) {
        await deleteCloudinaryImage(publicId).catch((err) =>
          console.error('Error deleting old Cloudinary profile image:', err)
        );
      }
    }

    // 2. Upload the new profile image buffer to Cloudinary in the 'user_profiles' folder.
    // The cloudinaryUpload function handles transformations based on the folder.
    const uploadResult = await cloudinaryUpload(
      req.file.buffer,
      'user_profiles'
    );
    newUploadedImageUrl = uploadResult.secure_url; // Store for potential cleanup

    // 3. Update the user's profileImage field with the new Cloudinary URL.
    user.profileImage = newUploadedImageUrl;
    await user.save(); // Save the updated user document

    res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      // Use .toObject() to ensure only necessary fields are returned and exclude password/otp
      data: { user: user },
    });
  } catch (error) {
    // If an error occurs during the process (e.g., Cloudinary upload error, database error),
    // and a new image was successfully uploaded to Cloudinary (i.e., newUploadedImageUrl is set),
    // delete it to clean up.
    if (newUploadedImageUrl) {
      const publicId = extractPublicId(newUploadedImageUrl);
      if (publicId) {
        await deleteCloudinaryImage(publicId).catch((err) =>
          console.error(
            'Error deleting new Cloudinary profile image after update failure:',
            err
          )
        );
      }
    }
    next(error); // Pass the error to the Express error handling middleware.
  }
};

/**
 * @desc    Remove a user's profile image
 * @route   DELETE /api/users/:id/profile-image
 * @access  Private (User/Admin)
 */
export const deleteProfileImage = async (req, res, next) => {
  try {
    const requestedUserId = req.params.id;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    // Authorization: User can delete their own profile image or an admin can delete any.
    if (
      String(requestedUserId) !== String(currentUserId) &&
      currentUserRole !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only remove your own profile image.',
      });
    }

    // const user = await User.findById(requestedUserId);
    const user = await User.findById(requestedUserId).select(
      '-password -otp -otpExpiry'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If a profile image exists, delete it from Cloudinary.
    if (user.profileImage) {
      const publicId = extractPublicId(user.profileImage);
      if (publicId) {
        await deleteCloudinaryImage(publicId).catch((err) =>
          console.error(
            'Error deleting Cloudinary profile image on removal:',
            err
          )
        );
      }
      user.profileImage = null; // Set profileImage to null in the database
      await user.save(); // Save the updated user document
    } else {
      return res.status(404).json({
        success: false,
        message: 'No profile image to remove.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile image removed successfully',
      data: { user: user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    // Only admin can update roles
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    const userId = req.params.id;
    const { role } = req.body;

    // Validate role value
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Role must be either "user" or "admin"',
      });
    }

    // Prevent admin from changing their own role
    if (String(userId) === String(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password -otp -otpExpiry');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    const userName = req.user?.userName;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find posts by the authenticated user
    const posts = await Post.find({ author: userId })
      .populate('author', 'firstName lastName userName')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalPosts = await Post.countDocuments({ author: userId });

    res.status(200).json({
      success: true,
      message: 'User posts retrieved successfully',
      message: `Hello ${userName} here are your list of post`,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
          hasNextPage: page < Math.ceil(totalPosts / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments made by a specific authenticated user

export const getUserComments = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Get user ID from authenticated user

    const comments = await Comment.find({ user: userId })
      .populate('post', 'title') // Populate post details
      .sort({ created_at: -1 }); // Latest comments first

    // --- NEW FEEDBACK LOGIC ---
    if (comments.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'You have not made any comments yet.',
        data: { comments: [] }, // Still return an empty array for consistency
      });
    }
    // --- END NEW FEEDBACK LOGIC ---

    res.status(200).json({
      success: true,
      message: 'Your comments retrieved successfully',
      data: { comments },
    });
  } catch (error) {
    next(error); // Pass error to central error handler
  }
};
