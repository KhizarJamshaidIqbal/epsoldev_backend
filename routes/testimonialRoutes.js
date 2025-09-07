import express from 'express';
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFeaturedTestimonials,
  toggleFeatured
} from '../controllers/testimonialController.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTestimonials);
router.get('/featured', getFeaturedTestimonials);
router.get('/:id', getTestimonialById);

// Protected routes (admin only) - temporarily public for testing
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);
router.patch('/:id/toggle-featured', toggleFeatured);

export default router;
