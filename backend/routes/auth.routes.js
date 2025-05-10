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
authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

//route for resending OTP for email verification
authRouter.post('/resend-verification', resendVerificationOTP);

// Protected routes (need to be logged in with valid token)
authRouter.put('/change-password', verifyToken, changePassword); // Change user password (protected)
authRouter.post('/sign-out', signOut);

export default authRouter;
