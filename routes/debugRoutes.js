import express from 'express';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Debug endpoint to check JWT token contents
router.get('/check-token', auth, (req, res) => {
  res.json({
    success: true,
    tokenData: req.user,
    message: 'This is what your JWT token contains'
  });
});

export default router;
