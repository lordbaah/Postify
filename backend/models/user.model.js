import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'first name required'],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: [true, 'last name required'],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    userName: {
      type: String,
      required: [true, 'userName required'],
      unique: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: 8,
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpiry: Date,
    // Add tokenVersion field to track password changes and force token invalidation
    tokenVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
