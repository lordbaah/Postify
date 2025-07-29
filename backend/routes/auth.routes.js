import { Router } from 'express';
import {
  signUpLimiter,
  signInLimiter,
  forgotPasswordLimiter,
  resendVerificationLimiter,
} from '../middlewares/rateLimiter.middleware.js';
import {
  signUp,
  signIn,
  verifyEmail,
  resendVerificationOTP,
  signOut,
  forgotPassword,
  resetPassword,
  changePassword,
  checkAuth,
} from '../controllers/auth.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const authRouter = Router();

// Public routes
authRouter.post('/signup', signUpLimiter, signUp);
authRouter.post('/signin', signInLimiter, signIn);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
authRouter.post('/reset-password', resetPassword);

//route for resending OTP for email verification after new registred account
authRouter.post(
  '/resend-verification',
  resendVerificationLimiter,
  resendVerificationOTP
);

// Protected routes (need to be logged in with valid token)
authRouter.put('/change-password', verifyToken, changePassword);
authRouter.post('/signout', verifyToken, signOut);

//route for checking authentication status
authRouter.get('/check-auth', verifyToken, checkAuth);

export default authRouter;
