import express from 'express';
import * as blogController from '../controllers/blogController.js';
import * as blogCategoryController from '../controllers/blogCategoryController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Blog Post Routes
router.get('/posts', blogController.getAllBlogs);
router.post('/posts', auth, blogController.createBlog);
router.get('/posts/:id/related', blogController.getRelatedBlogs);
router.get('/posts/:id', blogController.getBlogById);
router.put('/posts/:id', auth, blogController.updateBlog);
router.delete('/posts/:id', auth, blogController.deleteBlog);

// Blog Category Routes
router.get('/categories', blogCategoryController.getAllCategories);
router.post('/categories', auth, blogCategoryController.createCategory);
router.get('/categories/:id/posts', blogCategoryController.getBlogsByCategory);
router.get('/categories/:id', blogCategoryController.getCategoryById);
router.put('/categories/:id', auth, blogCategoryController.updateCategory);
router.delete('/categories/:id', auth, blogCategoryController.deleteCategory);

// Public Blog Routes (no auth required)
router.get('/public/posts', blogController.getPublishedBlogs);
router.get('/public/posts/featured', blogController.getFeaturedBlogs);
router.get('/public/posts/slug/:slug/related', blogController.getRelatedBlogsBySlug);
router.get('/public/posts/slug/:slug', blogController.getBlogBySlug);
router.post('/public/posts/slug/:slug/view', blogController.incrementViewCount);
router.get('/public/categories', blogCategoryController.getPublicCategories);
router.get('/public/categories/:slug/posts', blogCategoryController.getBlogsByCategorySlug);

export default router; 