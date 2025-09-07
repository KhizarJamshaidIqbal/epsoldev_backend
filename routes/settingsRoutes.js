import express from 'express';
import {
  getSettings,
  updateSettings,
  updateServiceSettings
} from '../controllers/settingsController.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getSettings);

// Protected routes (admin only)
router.put('/', auth, requireAdmin, updateSettings);
router.put('/services', auth, requireAdmin, updateServiceSettings);

export default router;
