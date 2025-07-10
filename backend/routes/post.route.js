import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const postRouter = Router();

// postRouter.post('/post-blog', verifyToken, createPost);
postRouter.post('/posts', verifyToken, createPost);
postRouter.get('/posts', getAllPosts); // Get posts by category name: example posts?category=Technology
postRouter.get('/posts/:id', getPostById);
postRouter.put('/posts/:id', verifyToken, updatePost);
postRouter.delete('/posts/:id', verifyToken, deletePost);

export default postRouter;
