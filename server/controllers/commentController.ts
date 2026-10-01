import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types.js';
import { dbStore } from '../services/dbStore.js';
import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';
import { getIsMongoConnected } from '../config/db.js';

/**
 * @desc    Get all comments for a post
 * @route   GET /api/comments/post/:postId
 * @access  Public
 */
export const getCommentsByPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { postId } = req.params;

    if (getIsMongoConnected()) {
      const comments = await CommentModel.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate('author', 'name email avatar bio');

      res.status(200).json({
        success: true,
        comments,
      });
    } else {
      const comments = await dbStore.findCommentsByPost(postId);
      res.status(200).json({
        success: true,
        comments,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a comment to a post
 * @route   POST /api/comments/post/:postId
 * @access  Private (Logged-in users)
 */
export const addComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required to post comments' });
      return;
    }

    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      res.status(400).json({ success: false, error: 'Comment content cannot be empty' });
      return;
    }

    if (content.trim().length > 1000) {
      res.status(400).json({ success: false, error: 'Comment cannot exceed 1000 characters' });
      return;
    }

    if (getIsMongoConnected()) {
      const post = await PostModel.findById(postId);
      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      const comment = await CommentModel.create({
        content: content.trim(),
        post: postId,
        author: req.user.id,
      });

      const populated = await CommentModel.findById(comment._id).populate(
        'author',
        'name email avatar bio'
      );

      res.status(201).json({
        success: true,
        message: 'Comment posted successfully',
        comment: populated,
      });
    } else {
      const post = await dbStore.findPostById(postId);
      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      const comment = await dbStore.addComment({
        content: content.trim(),
        postId,
        authorId: req.user.id,
      });

      res.status(201).json({
        success: true,
        message: 'Comment posted successfully',
        comment,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private (Comment author only)
 */
export const deleteComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const { id } = req.params;

    if (getIsMongoConnected()) {
      const comment = await CommentModel.findById(id);

      if (!comment) {
        res.status(404).json({ success: false, error: 'Comment not found' });
        return;
      }

      // Strict backend authorization check: comment author only
      if (comment.author.toString() !== req.user.id) {
        res.status(403).json({
          success: false,
          error: 'Forbidden: You can only delete your own comments',
        });
        return;
      }

      await CommentModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } else {
      const comment = await dbStore.findCommentById(id);

      if (!comment) {
        res.status(404).json({ success: false, error: 'Comment not found' });
        return;
      }

      // Strict backend authorization check: comment author only
      const commentAuthorId =
        typeof comment.author === 'string' ? comment.author : comment.author._id;
      if (commentAuthorId !== req.user.id) {
        res.status(403).json({
          success: false,
          error: 'Forbidden: You can only delete your own comments',
        });
        return;
      }

      await dbStore.deleteComment(id);

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};
