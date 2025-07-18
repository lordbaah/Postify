// commentController.js
import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

//Create a new comment
export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id; // Get user ID from authenticated user

    if (!text) {
      return res.status(422).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Create the comment
    const newComment = new Comment({
      post: postId,
      user: userId,
      text,
    });

    const savedComment = await newComment.save();

    // Populate user and post details for the response
    const populatedComment = await Comment.findById(savedComment._id)
      .populate('user', 'firstName lastName userName profilePicture') // Adjust fields as per your User model
      .populate('post', 'title'); // Adjust fields as per your Post model

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: { comment: populatedComment },
    });
  } catch (error) {
    next(error); // Pass error to central error handler
  }
};

//Get comments for a specific post
export const getCommentsForPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Optionally check if the post exists, though finding comments by post ID will naturally return empty if not.
    // const post = await Post.findById(postId);
    // if (!post) {
    //     return res.status(404).json({
    //         success: false,
    //         message: 'Post not found',
    //     });
    // }

    const comments = await Comment.find({ post: postId })
      .populate('user', 'firstName lastName userName profilePicture') // Populate user details
      .sort({ created_at: -1 }); // Latest comments first

    res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: { comments },
    });
  } catch (error) {
    next(error); // Pass error to central error handler
  }
};

//Delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Allow deletion if:
    // 1. The authenticated user is the comment's author.
    // 2. The authenticated user has an 'admin' role.
    if (comment.user.toString() !== userId.toString() && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    await comment.deleteOne(); // Use deleteOne() on the document instance

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error); // Pass error to central error handler
  }
};

//allow users to update their comments
export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!text) {
      return res.status(422).json({
        success: false,
        message: 'Comment text cannot be empty',
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Ensure only the comment owner can update
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment',
      });
    }

    comment.text = text;
    const updatedComment = await comment.save();

    const populatedComment = await Comment.findById(updatedComment._id)
      .populate('user', 'firstName lastName userName profilePicture')
      .populate('post', 'title');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment: populatedComment },
    });
  } catch (error) {
    next(error);
  }
};
