import BlogCategory from '../models/BlogCategory.js';
import Blog from '../models/Blog.js';

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({ order: 1, name: 1 });
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

// Get a single category by ID or slug
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    let category;

    // Check if the ID is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await BlogCategory.findById(id);
    } else {
      // If not, treat as slug
      category = await BlogCategory.findOne({ slug: id });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({ message: 'Failed to fetch category', error: error.message });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    console.log('Creating category with data:', req.body);
    console.log('Status field in request:', req.body.status);
    console.log('Status field type:', typeof req.body.status);
    const { name, slug } = req.body;

    // Check if category with the same name or slug already exists
    const existingCategory = await BlogCategory.findOne({
      $or: [{ name }, { slug }]
    });

    if (existingCategory) {
      return res.status(409).json({ message: 'Category with this name or slug already exists' });
    }

    const newCategory = new BlogCategory(req.body);
    console.log('New category object before save:', newCategory);
    const savedCategory = await newCategory.save();
    console.log('Saved category:', savedCategory);
    return res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    // Find by ID or slug
    let category;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await BlogCategory.findById(id);
    } else {
      category = await BlogCategory.findOne({ slug: id });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if another category with the same name or slug exists
    if (name !== category.name || slug !== category.slug) {
      const existingCategory = await BlogCategory.findOne({
        _id: { $ne: category._id },
        $or: [
          { name },
          { slug }
        ]
      });

      if (existingCategory) {
        return res.status(409).json({ message: 'Category with this name or slug already exists' });
      }
    }

    // Update with new values
    const updatedCategory = await BlogCategory.findByIdAndUpdate(
      category._id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    return res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find by ID or slug
    let category;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await BlogCategory.findById(id);
    } else {
      category = await BlogCategory.findOne({ slug: id });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if there are any blogs using this category
    const blogsWithCategory = await Blog.countDocuments({ category: category.slug });
    if (blogsWithCategory > 0) {
      return res.status(409).json({ 
        message: `Cannot delete category: ${blogsWithCategory} blog posts are using this category` 
      });
    }

    await BlogCategory.findByIdAndDelete(category._id);
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

// Get blogs by category
export const getBlogsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Find category by ID or slug
    let category;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await BlogCategory.findById(id);
    } else {
      category = await BlogCategory.findOne({ slug: id });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find blogs in this category
    const blogs = await Blog.find({ 
      category: category.slug,
      status: 'published'
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    // Get total count
    const count = await Blog.countDocuments({ 
      category: category.slug,
      status: 'published'
    });

    return res.status(200).json({
      blogs,
      category,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalItems: count
    });
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    return res.status(500).json({ message: 'Failed to fetch blogs by category', error: error.message });
  }
};

// PUBLIC API METHODS

// Get all published categories for public use
export const getPublicCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({ order: 1, name: 1 });
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching public categories:', error);
    return res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

// Get blogs by category slug for public view (only published blogs)
export const getBlogsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    // Find category by slug
    const category = await BlogCategory.findOne({ slug });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find published blogs in this category
    const blogs = await Blog.find({ 
      category: category.slug,
      status: 'published'
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));
    
    // Get total count
    const count = await Blog.countDocuments({ 
      category: category.slug,
      status: 'published'
    });

    return res.status(200).json({
      blogs,
      category,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      totalItems: count
    });
  } catch (error) {
    console.error('Error fetching blogs by category slug:', error);
    return res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
}; 