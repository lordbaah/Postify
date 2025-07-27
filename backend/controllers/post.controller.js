import Post from '../models/post.model.js';
import Category from '../models/category.model.js';
import Comment from '../models/comment.model.js';
// Import Cloudinary helper functions from the config file
import {
  cloudinaryUpload,
  deleteCloudinaryImage,
  extractPublicId,
} from '../config/cloudinary.config.js';

export const createPost = async (req, res, next) => {
  let uploadedImageUrl = null; // Variable to store the Cloudinary URL for potential cleanup
  try {
    const { title, content, category } = req.body;
    const userId = req.user?.id || req.userId;

    // Check if a file was uploaded via Multer (req.file contains the file buffer)
    if (req.file) {
      // Upload the image buffer to Cloudinary in the 'blog_posts' folder.
      // The cloudinaryUpload function handles transformations based on the folder.
      const uploadResult = await cloudinaryUpload(
        req.file.buffer,
        'blog_posts'
      );
      uploadedImageUrl = uploadResult.secure_url; // Store the Cloudinary URL
    }

    // Basic validation: Check if essential fields are provided.
    if (!title || !content || !category) {
      // If any required field is missing and an image was uploaded to Cloudinary, delete it.
      if (uploadedImageUrl) {
        const publicId = extractPublicId(uploadedImageUrl);
        if (publicId) {
          await deleteCloudinaryImage(publicId).catch((err) =>
            console.error(
              'Error deleting Cloudinary image during createPost validation:',
              err
            )
          );
        }
      }
      return res.status(422).json({
        success: false,
        message: 'Title, content, and category must be filled',
      });
    }

    // Verify if the provided category ID exists in the database.
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      // If the category does not exist and an image was uploaded to Cloudinary, delete it.
      if (uploadedImageUrl) {
        const publicId = extractPublicId(uploadedImageUrl);
        if (publicId) {
          await deleteCloudinaryImage(publicId).catch((err) =>
            console.error(
              'Error deleting Cloudinary image during createPost invalid category:',
              err
            )
          );
        }
      }
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Create a new post document in the database.
    // The 'image' field now stores the Cloudinary URL.
    const newPost = await Post.create({
      title,
      image: uploadedImageUrl, // Store the Cloudinary URL
      content,
      category,
      author: userId,
    });

    // Populate the 'author' and 'category' fields to include their details in the response.
    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'firstName lastName userName email')
      .populate('category', 'name');

    // Send a success response with the newly created and populated post data.
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post: populatedPost },
    });
  } catch (error) {
    // If any error occurs during the process (e.g., database error, Cloudinary upload error),
    // and an image was successfully uploaded to Cloudinary, delete it to clean up.
    if (uploadedImageUrl) {
      const publicId = extractPublicId(uploadedImageUrl);
      if (publicId) {
        await deleteCloudinaryImage(publicId).catch((err) =>
          console.error(
            'Error deleting Cloudinary image after post creation failure:',
            err
          )
        );
      }
    }
    next(error); // Pass the error to the Express error handling middleware.
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) {
      const categoryDoc = await Category.findOne({ name: req.query.category });
      if (!categoryDoc) {
        return res.status(404).json({
          success: false,
          message: `Category '${req.query.category}' not found`,
        });
      }
      filter.category = categoryDoc._id;
    }

    const posts = await Post.find(filter)
      .populate('author', 'firstName lastName userName profileImage')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments(filter);

    if (req.query.category && totalPosts === 0) {
      return res.status(200).json({
        success: true,
        message: `No posts found for category '${req.query.category}'`,
        data: {
          posts: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalPosts: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
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

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('author', 'firstName lastName userName profileImage')
      .populate('category', 'name');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comments = await Comment.find({ post: id })
      .populate('user', 'firstName lastName userName profileImage')
      .sort({ created_at: 1 });

    res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: {
        post: post,
        comments: comments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  let newUploadedImageUrl = null; // Variable to store the new Cloudinary URL for cleanup
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const userId = req.user?.id ? req.user.id.toString() : null;

    const post = await Post.findById(id);

    if (!post) {
      // If post not found and a new image was uploaded, delete it from Cloudinary.
      if (req.file) {
        // Since Multer is memoryStorage, the file is in req.file.buffer.
        // If an error occurred before database update, but after Multer processed,
        // we need to clean up the uploaded file from Cloudinary.
        // This is handled by the catch block if `newUploadedImageUrl` is set.
      }
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if the authenticated user is the author of the post.
    if (post.author.toString() !== userId) {
      // If not authorized and a new image was uploaded, delete it from Cloudinary.
      if (req.file) {
        // See comment above about cleanup in catch block.
      }
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    // Prepare an object to store the fields that will be updated.
    const updateFields = {
      title: title || post.title,
      content: content || post.content,
      category: category || post.category,
      updatedAt: new Date(),
    };

    // Logic for handling image updates:
    if (req.file) {
      // If a new image file was uploaded:
      // 1. If there was an old image associated with the post, delete it from Cloudinary.
      if (post.image) {
        const publicId = extractPublicId(post.image);
        if (publicId) {
          await deleteCloudinaryImage(publicId).catch((err) =>
            console.error(
              'Error deleting old Cloudinary image during update:',
              err
            )
          );
        }
      }
      // 2. Upload the new image buffer to Cloudinary.
      const uploadResult = await cloudinaryUpload(
        req.file.buffer,
        'blog_posts'
      );
      newUploadedImageUrl = uploadResult.secure_url; // Store for potential cleanup
      // 3. Set the image field in the database to the URL of the new uploaded image.
      updateFields.image = newUploadedImageUrl;
    } else if (req.body.image === '') {
      // This condition handles cases where the client explicitly sends an empty string for 'image',
      // signaling that the image should be removed from the post.
      if (post.image) {
        // If there was an existing image, delete it from Cloudinary.
        const publicId = extractPublicId(post.image);
        if (publicId) {
          await deleteCloudinaryImage(publicId).catch((err) =>
            console.error(
              'Error deleting Cloudinary image on explicit removal:',
              err
            )
          );
        }
      }
      // Set the image field in the database to null.
      updateFields.image = null;
    } else {
      // If no new image was uploaded (req.file is undefined) and no explicit removal was requested,
      // keep the existing image URL in the database.
      updateFields.image = post.image;
    }

    // Find the post by ID and update it with the prepared fields.
    const updatedPost = await Post.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('author', 'firstName lastName userName');

    // Send a success response with the updated post data.
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: { post: updatedPost },
    });
  } catch (error) {
    // If an error occurs during the update process (e.g., database error, Cloudinary upload error),
    // and a new image was successfully uploaded to Cloudinary (i.e., newUploadedImageUrl is set),
    // delete it to clean up.
    if (newUploadedImageUrl) {
      const publicId = extractPublicId(newUploadedImageUrl);
      if (publicId) {
        await deleteCloudinaryImage(publicId).catch((err) =>
          console.error(
            'Error deleting new Cloudinary image after post update failure:',
            err
          )
        );
      }
    }
    next(error); // Pass the error to the Express error handling middleware.
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id ? req.user.id.toString() : null;
    const currentUserRole = req.user.role;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user owns the post AND is not an admin, then they are unauthorized.
    // If user is the author OR is an admin, they are authorized.
    if (post.author.toString() !== userId && currentUserRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    // Before deleting the post document, delete the associated image from Cloudinary.
    if (post.image) {
      const publicId = extractPublicId(post.image);
      if (publicId) {
        await deleteCloudinaryImage(publicId).catch((err) =>
          console.error(
            'Error deleting Cloudinary image during post deletion:',
            err
          )
        );
      }
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ post: id });

    // Delete the post
    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post and associated comments deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
