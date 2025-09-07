import express from 'express';
import {
  getContactDetails,
  updateContactDetails,
  createContactDetails,
  deleteContactDetails
} from '../controllers/contactDetailsController.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getContactDetails);

// Protected routes (admin only) - temporarily public for testing
router.post('/', createContactDetails);
router.put('/', updateContactDetails);
router.delete('/', deleteContactDetails);

export default router;
