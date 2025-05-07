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
        message: 'Unauthorized: No token provided or Log In to have access',
      });
    }

    // Verify token
    const decodedToken = jwt.verify(token, ENV.JWT_SECRET);

    // Find user from token
    // const user = await User.findById(decodedToken.userId).select('-password');
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Invalid token', error: error.message });
  }
};

export default verifyToken;
