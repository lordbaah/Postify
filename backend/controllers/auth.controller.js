import mongoose from 'mongoose';
import User from '../models/user.model.js';
// import ENV from '../config/env.js';
import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import { generateOTP } from '../utils/generateOTP.js';
import { generateToken } from '../utils/generateToken.js';
import { renderTemplate } from '../views/renderTemplate.js';

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { firstName, lastName, userName, email, password } = req.body;

    // Validate input fields
    if (!firstName || !lastName || !userName || !email || !password) {
      return res
        .status(422)
        .json({ success: false, message: 'All fields must be filled' });
    }

    // Check if the user already exists
    const findExistingEmail = await User.findOne({ email }).session(session);
    const findExistingUserName = await User.findOne({ userName }).session(
      session
    );

    if (findExistingEmail || findExistingUserName) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: 'Email or Username already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();

    // Create new user with OTP and initial tokenVersion
    const newUser = await User.create(
      [
        {
          firstName,
          lastName,
          userName,
          email,
          password: hashedPassword,
          otp,
          // otpExpiry: Date.now() + 10 * 60 * 1000, // OTP expiry 10 minutes
          otpExpiry: Date.now() + 30 * 60 * 1000, // OTP expiry 30 minutes
          tokenVersion: 1, // Initialize token version
        },
      ],
      { session }
    );

    // Send OTP via email
    const html = renderTemplate('verifyAccount', { OTP: otp });

    await sendEmail({
      to: newUser[0].email,
      subject: 'Verify your Postify account',
      html,
    });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Generate JWT token with version information
    const token = generateToken(newUser[0]._id, newUser[0].tokenVersion);

    // Return success response and token
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: {
        token,
        user: {
          _id: newUser[0]._id,
          firstName: newUser[0].firstName,
          lastName: newUser[0].lastName,
          userName: newUser[0].userName,
          email: newUser[0].email,
          isVerified: newUser[0].isVerified,
          role: newUser[0].role,
        },
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(422)
        .json({ success: false, message: 'All fields must be filled' });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Check if verified
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ success: false, message: 'Please verify your account' });
    }

    // Generate JWT token with version
    const token = generateToken(user._id, user.tokenVersion);

    // Return success and token
    res.status(200).json({
      success: true,
      message: 'Sign in successful',
      data: {
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
          isVerified: user.isVerified,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { email, otp } = req.body; // Only require email and OTP

  try {
    if (!email || !otp) {
      return res
        .status(422)
        .json({ success: false, message: 'Email and OTP are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found Check the email entered',
      });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: 'Account already verified' });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Update the user to marked as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Send welcome email
    const html = renderTemplate('welcome', {
      FIRST_NAME: user.firstName,
    });
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Postify!',
      html,
    });

    res
      .status(200)
      .json({ success: true, message: 'Account verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationOTP = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(422)
        .json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    // Return the same message whether the user exists or not for security
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          'If your email is registered and not verified, a new OTP has been sent',
      });
    }

    // If user is already verified, no need to send OTP
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This account is already verified. Please sign in',
      });
    }

    // Generate and save new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    await user.save();

    // Send OTP via email
    const html = renderTemplate('verifyAccount', { OTP: otp });
    await sendEmail({
      to: user.email,
      subject: 'Verify your Postify account',
      html,
    });

    res.status(200).json({
      success: true,
      message:
        'If your email is registered and not verified, a new OTP has been sent',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(422)
        .json({ success: false, message: 'Email field must be filled' });
    }

    const user = await User.findOne({ email });

    // Don't reveal if user exists or not for security
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive an OTP shortly',
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expiry 10 minutes
    await user.save();

    // Send OTP via email
    const html = renderTemplate('resetPassword', { OTP: otp });
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html,
    });

    res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive an OTP shortly',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body; // Only require email and OTP

  try {
    if (!email || !otp || !newPassword) {
      return res.status(422).json({
        success: false,
        message: 'Email, OTP, and new password are required',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.resetToken = undefined; // Still clear the token after use

    // Increment token version to invalidate existing tokens
    user.tokenVersion = (user.tokenVersion || 1) + 1;

    await user.save();

    // Send confirmation email
    const html = renderTemplate('passwordChangeConfrimation', {
      FIRST_NAME: user.firstName,
    });
    await sendEmail({
      to: user.email,
      subject: 'Password Updated!',
      html,
    });

    res.status(200).json({
      success: true,
      message:
        'Password reset successful. Please sign in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res
        .status(422)
        .json({ success: false, message: 'All fields must be filled' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: 'Incorrect current password' });
    }

    // Ensure new password is different from the current one
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from the current password',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Increment token version to invalidate existing tokens - THIS FIXES THE BUG
    user.tokenVersion = (user.tokenVersion || 1) + 1;

    await user.save();

    // Send confirmation email
    const html = renderTemplate('passwordChangeConfrimation', {
      FIRST_NAME: user.firstName,
    });
    await sendEmail({
      to: user.email,
      subject: 'Password Updated!',
      html,
    });

    res.status(200).json({
      success: true,
      message:
        'Password changed successfully. Please sign in again with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Invalidate the token by incrementing the tokenVersion
    await User.findByIdAndUpdate(userId, {
      $inc: { tokenVersion: 1 },
    });

    // Clear the cookie if you're using cookies
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Successfully logged out',
    });
  } catch (error) {
    next(error);
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Format response to match what the client expects
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
          isVerified: user.isVerified,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
