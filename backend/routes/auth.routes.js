import { Router } from 'express';
import {
  signUp,
  signIn,
  verifyEmail,
  resendVerificationOTP,
  signOut,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/auth.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const authRouter = Router();

// Public routes
authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

//route for resending OTP for email verification after new registred account
authRouter.post('/resend-verification', resendVerificationOTP);

// Protected routes (need to be logged in with valid token)
authRouter.put('/change-password', verifyToken, changePassword);
authRouter.post('/signout', verifyToken, signOut);

export default authRouter;
