import express from 'express';
import {
  getAllContent,
  getContentByType,
  createContent,
  updateContent,
  deleteContent,
  updateContentStatus,
  getContentStats
} from '../controllers/contentController.js';

const router = express.Router();

// Public routes (for testing)
router.get('/', getAllContent);
router.get('/stats', getContentStats);
router.get('/:type', getContentByType);

// Admin routes (temporarily public for testing)
router.post('/', createContent);
router.put('/:type', updateContent);
router.delete('/:type', deleteContent);
router.patch('/:type/status', updateContentStatus);

export default router;
