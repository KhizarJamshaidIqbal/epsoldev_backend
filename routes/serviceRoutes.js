import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getFeaturedServices
} from '../controllers/serviceController.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.get('/featured', getFeaturedServices);
router.get('/:id', getServiceById);

// Protected routes (admin only) - temporarily public for testing
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
