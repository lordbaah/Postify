import Post from '../models/post.model.js';
import Category from '../models/category.model.js';
import Comment from '../models/comment.model.js';

export const createPost = async (req, res, next) => {
  try {
    const { title, image, content, category } = req.body;
    const userId = req.user?.id || req.userId;

    if (!title || !content || !category) {
      return res.status(422).json({
        success: false,
        message: 'All fields must be filled',
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const newPost = await Post.create({
      title,
      image: image || null,
      content,
      category,
      author: userId,
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'firstName lastName userName email')
      .populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post: populatedPost },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Add category filter by name
    const filter = {};
    if (req.query.category) {
      // First find the category by name to get its ID
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
      .populate('author', 'firstName lastName userName')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments(filter);

    // Check if no posts found for the category
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
      message: 'Posts retrived successfully',
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
      .populate('author', 'firstName lastName userName')
      .populate('category', 'name');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // === NEW: Fetch comments for this post ===
    const comments = await Comment.find({ post: id })
      .populate('user', 'firstName lastName userName') // Populate user details for comments
      .sort({ created_at: 1 }); // Or -1 for latest first

    res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: {
        post: post,
        comments: comments, // Include comments in the response data
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, image, content, category } = req.body;
    // const userId = req.user?.id || req.userId;
    const userId = req.user?.id ? req.user.id.toString() : null;

    // Find the post
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title: title || post.title,
        image: image !== undefined ? image : post.image,
        content: content || post.content,
        category: category || post.category,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).populate('author', 'firstName lastName userName');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: { post: updatedPost },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const userId = req.user?.id || req.userId;
    const userId = req.user?.id ? req.user.id.toString() : null;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
