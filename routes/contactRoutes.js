import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  updateContactStatus,
  getContactsByStatus,
  getContactStats
} from '../controllers/contactController.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllContacts);
router.get('/stats', getContactStats);
router.get('/status/:status', getContactsByStatus);
router.get('/:id', getContactById);
router.post('/', createContact); // Public contact form submission

// Protected routes (admin only) - temporarily public for testing
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);
router.patch('/:id/status', updateContactStatus);

export default router;
