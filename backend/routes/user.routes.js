import { Router } from 'express';
import { getUsers, getUser } from '../controllers/user.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/authorize.middle.js';

const userRouter = Router();

//get all users admin route
userRouter.get('/', verifyToken, authorizeRoles('admin'), getUsers);

//single user profile
userRouter.get('/profile/:id', verifyToken, getUser);

//admin accessing dashboard
userRouter.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.send({ message: 'Welcome Admin!' });
});

userRouter.post('/', (req, res) => {
  res.send({ title: 'create new user' });
});

userRouter.put('/:id', (req, res) => {
  res.send({ title: 'update user details' });
});

//delete user admin
userRouter.delete('/:id', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.send({ title: 'delete user details' });
});

export default userRouter;
