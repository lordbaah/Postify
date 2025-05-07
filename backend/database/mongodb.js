import mongoose from 'mongoose';
import ENV from '../config/env.js';

const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_DB_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
