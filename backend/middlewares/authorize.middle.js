/**
 * Middleware to restrict access based on user roles
 * @param  {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Middleware function
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // The authenticated user (should be set by previous middleware)

    // If user doesn't exist or their role is not in the list of allowedRoles
    if (!user || !allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: 'Access denied: insufficient permissions' });
    }

    // User has one of the allowed roles, continue to the route handler
    next();
  };
};

// module.exports = authorizeRoles;
export default authorizeRoles;
