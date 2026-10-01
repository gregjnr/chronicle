import { Router } from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  getCategoriesAndTags,
} from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getAllPosts);
router.get('/categories-tags', getCategoriesAndTags);

// Protected routes (Note: /user/me must be placed before /:id to prevent route shadowing)
router.get('/user/me', authenticate, getUserPosts);
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

// Public single post route
router.get('/:id', getPostById);

export default router;
