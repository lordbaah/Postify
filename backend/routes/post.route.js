import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import { uploadPostImage } from '../middlewares/upload.middleware.js';

const postRouter = Router();

// Route for creating a post
// apply verifyToken first for authentication, then uploadPostImage.single('image') for file handling.
// 'image' should match the name attribute of your file input in the frontend form (e.g., <input type="file" name="image">)
postRouter.post(
  '/posts',
  verifyToken,
  uploadPostImage.single('image'),
  createPost
);

// Route for getting all posts (no file upload needed)
postRouter.get('/posts', getAllPosts); // Get posts by category name: example posts?category=Technology

// Route for getting a single post by ID (no file upload needed)
postRouter.get('/posts/:id', getPostById);

// Route for updating a post
// apply verifyToken first for authentication, then uploadPostImage.single('image') for file handling.
// This allows updating post content and/or the image.
postRouter.put(
  '/posts/:id',
  verifyToken,
  uploadPostImage.single('image'),
  updatePost
);

// Route for deleting a post (no file upload needed)
postRouter.delete('/posts/:id', verifyToken, deletePost);

// Example usage comments (for reference, not part of the code logic)
// http://localhost:5000/api/v1/blog/posts?page=1&limit=10
// http://localhost:5000/api/v1/blog/posts?category=Technology
// http://localhost:5000/api/v1/blog/posts?category=Technology&page=1&limit=10

export default postRouter;
