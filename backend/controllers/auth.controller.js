import mongoose from 'mongoose';
import User from '../models/user.model.js';
import ENV from '../config/env.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import { generateOTP } from '../utils/generateOTP.js';
import { renderTemplate } from '../views/renderTemplate.js';

//bug to fix => user token already existing should be removed when a user change password or users should be logged out after changing password

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
    const findExistingUser = await User.findOne({
      $or: [{ email }, { userName }],
    }).session(session);

    if (findExistingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();

    // Create new user with OTP
    const newUser = await User.create(
      [
        {
          firstName,
          lastName,
          userName,
          email,
          password: hashedPassword,
          otp,
          otpExpiry: Date.now() + 10 * 60 * 1000, // OTP expiry 10 minutes
        },
      ],
      { session }
    );

    // Send OTP via email
    const html = renderTemplate('verifyAccount', { OTP: otp });

    await sendEmail({
      to: newUser[0].email,
      subject: 'Verify your Postify account',
      // html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
      html,
    });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser[0]._id }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    });

    // Return success response and token
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      // token,
      data: { token, user: newUser[0] },
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
        .json({ success: false, message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    //check if verified
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ success: false, message: 'Please verify your account' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    });

    //return success and token
    res.status(201).json({
      success: true,
      message: 'Sign In successfully',
      // token,
      // user: { id: user._id, username: user.userName, role: user.role },
      data: { token, user },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res
        .status(422)
        .json({ success: false, message: 'All fields must be filled' });
    }

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });

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

    //send email
    const html = renderTemplate('welcome', {
      FIRST_NAME: user.firstName,
    });
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Postify!',
      html,
    });

    res
      .status(201)
      .json({ success: true, message: 'Account verified successfully' });
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
        .json({ success: false, message: 'email field must be filled' });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; //OTP expiry 10 minutes
    await user.save();

    // Send OTP via email
    const html = renderTemplate('resetPassword', { OTP: otp });
    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      // html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 10 minutes. ignore this message if you didn't request for OTP code, Don't share with anyone</p>`,
      html,
    });

    res.status(201).json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res
        .status(422)
        .json({ success: false, message: 'All fields must be filled' });
    }

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
    await user.save();

    //send message
    const html = renderTemplate('passwordChangeConfrimation', {
      FIRST_NAME: user.firstName,
    });
    await sendEmail({
      to: user.email,
      subject: 'Password Updated!',
      html,
    });

    res
      .status(200)
      .json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  const { id } = req.user; // from auth middleware
  const { firstName, lastName, userName } = req.body;

  try {
    if (!firstName || !lastName || !userName) {
      return res
        .status(422)
        .json({ success: false, message: 'All fields must be filled' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, userName },
      { new: true }
    );
    // res.json(user);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
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

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    // Optional: If you're using JWT in cookies, clear the cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    next(error);
  }
};
