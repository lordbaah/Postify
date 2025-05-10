import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ENV from '../config/env.js';

const verifyToken = async (req, res, next) => {
  try {
    let token;

    // Check if the Authorization header exists and starts with Bearer
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token is found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided or Log In to have access',
      });
    }

    // Verify token
    const decodedToken = jwt.verify(token, ENV.JWT_SECRET);

    // Find user from token
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found',
      });
    }

    // Check if token version matches current user's token version
    // This is the key part that fixes the security issue with password changes
    if (decodedToken.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message:
          'Your session has expired due to security changes. Please sign in again.',
      });
    }

    // Attach user to request (only include necessary properties)
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      isVerified: user.isVerified,
      userName: user.userName,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
      error: error.message,
    });
  }
};

export default verifyToken;
