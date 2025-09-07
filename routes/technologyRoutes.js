import express from 'express';
import {
  getAllTechnologies,
  getTechnology,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  getTechnologyCategories,
  getFeaturedTechnologies,
  updateUsageCount
} from '../controllers/technologyController.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

console.log('🔧 Technology routes file loaded successfully');

// Public routes
router.get('/', getAllTechnologies);
router.get('/categories', getTechnologyCategories);
router.get('/featured', getFeaturedTechnologies);
router.get('/:id', getTechnology);

// Protected routes (admin only) - TEMPORARILY DISABLED FOR DEVELOPMENT
// router.use(auth, requireAdmin); // Uncomment this line for production
router.post('/', createTechnology);
router.put('/:id', updateTechnology);
router.delete('/:id', deleteTechnology);
router.put('/usage-count/update', updateUsageCount);

export default router;
