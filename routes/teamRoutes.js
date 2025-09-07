import express from 'express';
import {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  updateTeamMemberOrder,
  getActiveTeamMembers
} from '../controllers/teamController.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTeamMembers);
router.get('/active', getActiveTeamMembers);
router.get('/:id', getTeamMemberById);

// Protected routes (admin only) - temporarily public for testing
router.post('/', createTeamMember);
router.put('/:id', updateTeamMember);
router.delete('/:id', deleteTeamMember);
router.patch('/:id/order', updateTeamMemberOrder);

export default router;
