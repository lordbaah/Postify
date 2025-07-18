import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';

export const getUsers = async (req, res, next) => {
  try {
    // The authorizeRoles middleware already checks if the user is admin
    const users = await User.find().select('-password -otp -otpExpiry');

    res
      .status(200)
      .json({ success: true, message: 'Here are list of users', data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    // console.log('Requested User ID:', typeof req.params.id);
    // console.log('Token User ID:', typeof req.user.id);

    const requestedUserId = req.params.id;
    const currentUserId = req.user.id; // From auth middleware

    // Check if user is accessing their own profile or is an admin
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
    const requestedUserId = req.params.id || req.user.id; // Use params ID if provided, otherwise use authenticated user's ID
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    // Check if user is updating their own profile or is an admin
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
