import express from 'express';
import {
  getAllProjectRequests,
  getProjectRequestById,
  createProjectRequest,
  updateProjectRequest,
  deleteProjectRequest,
  updateProjectRequestStatus,
  getProjectRequestsByStatus,
  getProjectRequestStats
} from '../controllers/projectRequestController.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProjectRequests);
router.get('/stats', getProjectRequestStats);
router.get('/status/:status', getProjectRequestsByStatus);
router.get('/:id', getProjectRequestById);

// Protected routes (admin only) - temporarily public for testing
router.post('/', createProjectRequest);
router.put('/:id', updateProjectRequest);
router.delete('/:id', deleteProjectRequest);
router.patch('/:id/status', updateProjectRequestStatus);

export default router;
