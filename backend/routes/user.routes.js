import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateProfile,
  updateUserRole,
  getUserPosts,
  getUserComments,
  updateProfileImage, // Import the new profile image update controller
  deleteProfileImage, // Import the new profile image delete controller
} from '../controllers/user.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/authorize.middle.js';
// Import the specific Multer middleware for profile images
import { uploadProfileImage } from '../middlewares/upload.middleware.js';

const userRouter = Router();

// Admin routes
userRouter.get('/', verifyToken, authorizeRoles('admin'), getUsers);
userRouter.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.send({ message: 'Welcome Admin!' });
});
userRouter.put(
  '/role/:id',
  verifyToken,
  authorizeRoles('admin'),
  updateUserRole
);
userRouter.delete('/:id', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.send({ title: 'delete user details' });
});

// User profile routes
userRouter.get('/profile', verifyToken, (req, res, next) => {
  req.params.id = req.user.id; // Set the ID to the authenticated user's ID
  getUser(req, res, next);
});
userRouter.get('/profile/:id', verifyToken, getUser);

// Get list of posts by authenticated user
userRouter.get('/posts', verifyToken, getUserPosts);

// Get list of comments by authenticated user
userRouter.get('/comments', verifyToken, getUserComments);

// Profile update routes
userRouter.put('/profile', verifyToken, (req, res, next) => {
  // For updating own profile (no ID parameter needed)
  updateProfile(req, res, next);
});
userRouter.put('/profile/:id', verifyToken, updateProfile);

// NEW: Route for updating user profile image
// 'profileImage' should match the name attribute of your file input in the frontend form.
userRouter.put(
  '/profile/:id/image',
  verifyToken,
  uploadProfileImage.single('profileImage'),
  updateProfileImage
);

// NEW: Route for deleting user profile image
userRouter.delete('/profile/:id/image', verifyToken, deleteProfileImage);

export default userRouter;
