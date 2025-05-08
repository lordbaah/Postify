import { Router } from 'express';
import { getUsers, getUser } from '../controllers/user.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/authorize.middle.js';

const userRouter = Router();

//get all users admin route
userRouter.get('/', getUsers);

//single user
userRouter.get('/profile/:id', verifyToken, getUser);

userRouter.post('/', (req, res) => {
  res.send({ title: 'create new user' });
});

userRouter.put('/:id', (req, res) => {
  res.send({ title: 'update user details' });
});

userRouter.delete('/:id', (req, res) => {
  res.send({ title: 'delete user details' });
});

userRouter.get(
  '/admin-only',
  verifyToken,
  authorizeRoles('admin'),
  (req, res) => {
    res.send({ message: 'Welcome Admin!' });
  }
);

userRouter.get(
  '/user-or-admin',
  verifyToken,
  authorizeRoles('user', 'admin'),
  (req, res) => {
    res.send({ message: 'Welcome User or Admin!' });
  }
);

export default userRouter;

/**
 * Route accessible only to admin users
 */
// router.get('/admin-only', authorizeRoles('admin'), (req, res) => {
//   res.send('Welcome Admin!');
// });

/**
 * Route accessible to both user and admin roles
 */
// router.get('/user-or-admin', authorizeRoles('user', 'admin'), (req, res) => {
//   res.send('Welcome User or Admin!');
// });

// module.exports = router;
