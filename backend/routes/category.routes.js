import { Router } from 'express';
import verifyToken from '../middlewares/auth.middleware.js';
import authorizeRoles from '../middlewares/authorize.middle.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';

const categoryRouter = Router();

// Routes
categoryRouter.post(
  '/categories',
  verifyToken,
  authorizeRoles('admin'), // only admins can create
  createCategory
);

categoryRouter.get('/categories', getAllCategories);

categoryRouter.get('/categories/:id', getCategoryById);

categoryRouter.put(
  '/categories/:id',
  verifyToken,
  authorizeRoles('admin'),
  updateCategory
);

categoryRouter.delete(
  '/categories/:id',
  verifyToken,
  authorizeRoles('admin'),
  deleteCategory
);

export default categoryRouter;
