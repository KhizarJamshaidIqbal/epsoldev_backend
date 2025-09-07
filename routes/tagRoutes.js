import express from 'express';
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  getPopularTags
} from '../controllers/tagController.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTags);
router.get('/popular', getPopularTags);
router.get('/:id', getTagById);

// Protected routes (admin only) - temporarily public for testing
router.post('/', createTag);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
