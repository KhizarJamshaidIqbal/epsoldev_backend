import express from 'express';
import {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  updateFAQStatus,
  getFAQStats
} from '../controllers/faqController.js';

const router = express.Router();

// Public routes (for testing)
router.get('/', getAllFAQs);
router.get('/stats', getFAQStats);
router.get('/:id', getFAQById);

// Admin routes (temporarily public for testing)
router.post('/', createFAQ);
router.put('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);
router.patch('/:id/status', updateFAQStatus);

export default router;
