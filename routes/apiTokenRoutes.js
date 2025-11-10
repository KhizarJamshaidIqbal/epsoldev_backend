import express from 'express';
import {
  getApiTokens,
  getApiToken,
  createApiToken,
  updateApiToken,
  deleteApiToken,
  revokeApiToken,
  activateApiToken,
  getApiTokenStats,
} from '../controllers/apiTokenController.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and require admin access
router.use(auth);
router.use(requireAdmin);

// Stats route (must come before /:id to avoid conflicts)
router.get('/stats', getApiTokenStats);

// CRUD routes
router.route('/').get(getApiTokens).post(createApiToken);

router.route('/:id').get(getApiToken).put(updateApiToken).delete(deleteApiToken);

// Action routes
router.put('/:id/revoke', revokeApiToken);
router.put('/:id/activate', activateApiToken);

export default router;
