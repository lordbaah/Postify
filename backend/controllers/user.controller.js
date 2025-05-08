import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res
      .status(200)
      .json({ success: true, message: 'Here are list of users', data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      // const error = new Error('User not Found');
      // error.statusCode = 404;
      // throw error;
      res.status(404).json({ success: false, message: 'user not found' });
    }

    res.status(200).json({
      success: true,
      message: `Welcome to ypur profile ${user.userName}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
