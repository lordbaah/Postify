import { Router } from 'express';
import {
  signUp,
  signIn,
  verifyEmail,
  signOut,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const authRouter = Router();

// Define routes
authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/sign-out', signOut);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

// Protected routes
authRouter.put('/update-profile', verifyToken, updateProfile); // Update user profile
authRouter.put('/change-password', verifyToken, changePassword); // Change current passwor

export default authRouter;
