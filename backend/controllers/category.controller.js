import Category from '../models/category.model.js';
import Post from '../models/post.model.js';

// Create Category (Admin only)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(422).json({
        success: false,
        message: 'Category name is required',
      });
    }

    // Get user from request from auth middleware)
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required',
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    // Create the category
    const newCategory = await Category.create({
      name: name.trim(),
      description: description?.trim(),
      createdBy: userId,
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category: newCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate('createdBy', 'name email')
      .sort({ name: 1 }); // Sort alphabetically for better UX

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update category (Admin only)
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(422).json({
        success: false,
        message: 'Category name is required',
      });
    }

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if another category with the same name exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Another category with this name already exists',
      });
    }

    // Update the category
    category.name = name.trim();
    category.description = description?.trim();
    await category.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).populate(
      'createdBy',
      'name email'
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // 2. Check if any posts reference this category
    const postCount = await Post.countDocuments({ category: id });
    if (postCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: It is referenced by ${postCount} post(s).`,
      });
    }

    // 3. Delete the category
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
