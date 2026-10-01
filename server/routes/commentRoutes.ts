import { Router } from 'express';
import {
  getCommentsByPost,
  addComment,
  deleteComment,
} from '../controllers/commentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public route to view comments for a post
router.get('/post/:postId', getCommentsByPost);

// Protected routes: add comment and delete comment
router.post('/post/:postId', authenticate, addComment);
router.delete('/:id', authenticate, deleteComment);

export default router;
