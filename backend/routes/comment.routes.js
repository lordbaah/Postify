// routes/comment.routes.js
import { Router } from 'express';
import {
  createComment,
  getCommentsForPost,
  // getUserComments,
  deleteComment,
  updateComment,
} from '../controllers/comment.controller.js'; // Adjust path if necessary
import verifyToken from '../middlewares/auth.middleware.js'; // Your authentication middleware

const commentRouter = Router();

// Route for creating a comment on a specific post
// POST /api/v1/blog/posts/:postId/comments
commentRouter.post('/posts/:postId/comments', verifyToken, createComment);

// Route for getting all comments for a specific post
// GET /api/v1/blog/posts/:postId/comments
commentRouter.get('/posts/:postId/comments', getCommentsForPost); // Public access

// Route for getting all comments made by the authenticated user
// GET /api/v1/users/my-comments (or /api/v1/comments/my-comments)
// I'm putting it under /api/v1/users/my-comments as it's user-specific,
// mirroring how you have '/api/v1/users' for user operations.
// commentRouter.get('/users/my-comments', verifyToken, getUserComments);

// Routes for individual comments (update, delete)
// PUT /api/v1/blog/comments/:id
// DELETE /api/v1/blog/comments/:id
commentRouter
  .route('/comments/:id')
  .put(verifyToken, updateComment)
  .delete(verifyToken, deleteComment);

export default commentRouter;
