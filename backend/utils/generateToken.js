import jwt from 'jsonwebtoken';
import ENV from '../config/env.js';

/**
 * Generates a JWT token with tokenVersion included to enable invalidation
 *
 * @param {string} userId - The user's ID
 * @param {number} tokenVersion - The current token version from user record
 * @returns {string} JWT token
 */
export const generateToken = (userId, tokenVersion) => {
  return jwt.sign(
    {
      userId,
      tokenVersion, // Including version in token payload enables future validation
    },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN }
  );
};
