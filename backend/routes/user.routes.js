import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateProfile,
  updateUserRole,
} from '../controllers/user.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/authorize.middle.js';

const userRouter = Router();

// Admin routes
userRouter.get('/', verifyToken, authorizeRoles('admin'), getUsers);
userRouter.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.send({ message: 'Welcome Admin!' });
});
userRouter.patch(
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

// Profile update routes
userRouter.patch('/profile', verifyToken, (req, res, next) => {
  // For updating own profile (no ID parameter needed)
  updateProfile(req, res, next);
});
userRouter.patch('/profile/:id', verifyToken, updateProfile);

export default userRouter;
