import express from 'express';
import * as commentController from '../controllers/commentController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes (require authentication)
router.get('/comments', auth, commentController.getAllComments);
router.get('/comments/stats', commentController.getCommentStats);
router.post('/comments/batch', auth, commentController.batchUpdateComments);
router.put('/comments/:id/status', auth, commentController.updateCommentStatus);
router.delete('/comments/:id', auth, commentController.deleteComment);

// Public routes (no auth required)
router.get('/posts/:postId/comments', commentController.getCommentsForPost);
router.post('/comments', commentController.addComment);

export default router; 