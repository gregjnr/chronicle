import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types.js';
import { dbStore } from '../services/dbStore.js';
import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';
import { getIsMongoConnected } from '../config/db.js';

/**
 * @desc    Get all published posts with pagination, search & filters
 * @route   GET /api/posts
 * @access  Public
 */
export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 6;
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || '';
    const tag = (req.query.tag as string) || '';
    const sort = (req.query.sort as 'newest' | 'oldest' | 'views') || 'newest';

    if (getIsMongoConnected()) {
      const query: any = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (tag) {
        query.tags = tag;
      }

      const sortOptions: any = {};
      if (sort === 'oldest') sortOptions.createdAt = 1;
      else if (sort === 'views') sortOptions.views = -1;
      else sortOptions.createdAt = -1;

      const totalPosts = await PostModel.countDocuments(query);
      const totalPages = Math.max(1, Math.ceil(totalPosts / limit));
      const skip = (page - 1) * limit;

      const posts = await PostModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email avatar bio');

      res.status(200).json({
        success: true,
        posts,
        totalPosts,
        totalPages,
        currentPage: page,
      });
    } else {
      const result = await dbStore.findPosts({
        search,
        category,
        tag,
        sort,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        posts: result.posts,
        totalPosts: result.totalPosts,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (getIsMongoConnected()) {
      const post = await PostModel.findById(id).populate('author', 'name email avatar bio');

      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      // Increment views count
      post.views = (post.views || 0) + 1;
      await post.save();

      const commentCount = await CommentModel.countDocuments({ post: id });

      res.status(200).json({
        success: true,
        post,
        commentCount,
      });
    } else {
      const post = await dbStore.findPostById(id);

      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      await dbStore.incrementPostViews(id);
      const commentCount = await dbStore.countCommentsForPost(id);

      res.status(200).json({
        success: true,
        post: { ...post, views: (post.views || 0) + 1 },
        commentCount,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private (Logged in users only)
 */
export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authorization required' });
      return;
    }

    const { title, content, excerpt, coverImage, category, tags } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ success: false, error: 'Post title is required' });
      return;
    }
    if (!content || !content.trim()) {
      res.status(400).json({ success: false, error: 'Post content is required' });
      return;
    }
    if (!category) {
      res.status(400).json({ success: false, error: 'Category is required' });
      return;
    }

    // Process tags into an array of clean strings
    const processedTags = Array.isArray(tags)
      ? tags.map((t: string) => t.trim()).filter(Boolean)
      : typeof tags === 'string'
      ? tags
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

    if (getIsMongoConnected()) {
      const post = await PostModel.create({
        title: title.trim(),
        content,
        excerpt: excerpt?.trim(),
        coverImage: coverImage?.trim() || '',
        category,
        tags: processedTags,
        author: req.user.id,
      });

      const populatedPost = await PostModel.findById(post._id).populate(
        'author',
        'name email avatar bio'
      );

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        post: populatedPost,
      });
    } else {
      const post = await dbStore.createPost({
        title: title.trim(),
        content,
        excerpt: excerpt?.trim(),
        coverImage: coverImage?.trim() || '',
        category,
        tags: processedTags,
        authorId: req.user.id,
      });

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        post,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing post
 * @route   PUT /api/posts/:id
 * @access  Private (Post author only)
 */
export const updatePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authorization required' });
      return;
    }

    const { id } = req.params;
    const { title, content, excerpt, coverImage, category, tags } = req.body;

    if (getIsMongoConnected()) {
      const post = await PostModel.findById(id);

      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      // Strict backend authorization check
      if (post.author.toString() !== req.user.id) {
        res.status(403).json({
          success: false,
          error: 'Forbidden: You are not authorized to edit this post.',
        });
        return;
      }

      if (title) post.title = title.trim();
      if (content) post.content = content;
      if (excerpt !== undefined) post.excerpt = excerpt.trim();
      if (coverImage !== undefined) post.coverImage = coverImage.trim();
      if (category) post.category = category;
      if (tags !== undefined) {
        post.tags = Array.isArray(tags)
          ? tags.map((t: string) => t.trim()).filter(Boolean)
          : typeof tags === 'string'
          ? tags
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [];
      }

      await post.save();
      const updatedPost = await PostModel.findById(id).populate(
        'author',
        'name email avatar bio'
      );

      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        post: updatedPost,
      });
    } else {
      const post = await dbStore.findPostById(id);

      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      // Strict backend authorization check
      const postAuthorId = typeof post.author === 'string' ? post.author : post.author._id;
      if (postAuthorId !== req.user.id) {
        res.status(403).json({
          success: false,
          error: 'Forbidden: You are not authorized to edit this post.',
        });
        return;
      }

      const processedTags =
        tags !== undefined
          ? Array.isArray(tags)
            ? tags.map((t: string) => t.trim()).filter(Boolean)
            : typeof tags === 'string'
            ? tags
                .split(',')
                .map((t: string) => t.trim())
                .filter(Boolean)
            : []
          : undefined;

      const updated = await dbStore.updatePost(id, {
        title: title?.trim(),
        content,
        excerpt: excerpt?.trim(),
        coverImage: coverImage?.trim(),
        category,
        tags: processedTags,
      });

      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        post: updated,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private (Post author only)
 */
export const deletePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authorization required' });
      return;
    }

    const { id } = req.params;

    if (getIsMongoConnected()) {
      const post = await PostModel.findById(id);

      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      // Strict backend authorization check
      if (post.author.toString() !== req.user.id) {
        res.status(403).json({
          success: false,
          error: 'Forbidden: You are not authorized to delete this post.',
        });
        return;
      }

      await PostModel.findByIdAndDelete(id);
      // Cascade delete comments
      await CommentModel.deleteMany({ post: id });

      res.status(200).json({
        success: true,
        message: 'Post and associated comments deleted successfully',
      });
    } else {
      const post = await dbStore.findPostById(id);

      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      // Strict backend authorization check
      const postAuthorId = typeof post.author === 'string' ? post.author : post.author._id;
      if (postAuthorId !== req.user.id) {
        res.status(403).json({
          success: false,
          error: 'Forbidden: You are not authorized to delete this post.',
        });
        return;
      }

      await dbStore.deletePost(id);

      res.status(200).json({
        success: true,
        message: 'Post and associated comments deleted successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all posts by current logged-in user (Author Dashboard)
 * @route   GET /api/posts/user/me
 * @access  Private
 */
export const getUserPosts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authorization required' });
      return;
    }

    if (getIsMongoConnected()) {
      const posts = await PostModel.find({ author: req.user.id })
        .sort({ createdAt: -1 })
        .populate('author', 'name email avatar bio');

      const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
      const postIds = posts.map((p) => p._id);
      const totalComments = await CommentModel.countDocuments({ post: { $in: postIds } });

      res.status(200).json({
        success: true,
        posts,
        stats: {
          totalPosts: posts.length,
          totalViews,
          totalComments,
        },
      });
    } else {
      const result = await dbStore.findPosts({
        authorId: req.user.id,
        limit: 100,
        sort: 'newest',
      });

      const totalViews = result.posts.reduce((sum, p) => sum + (p.views || 0), 0);
      let totalComments = 0;
      for (const p of result.posts) {
        totalComments += await dbStore.countCommentsForPost(p._id);
      }

      res.status(200).json({
        success: true,
        posts: result.posts,
        stats: {
          totalPosts: result.posts.length,
          totalViews,
          totalComments,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get metadata: categories and tags with counts
 * @route   GET /api/posts/categories-tags
 * @access  Public
 */
export const getCategoriesAndTags = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (getIsMongoConnected()) {
      const categories = await PostModel.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]);

      const tags = await PostModel.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]);

      const totalPosts = await PostModel.countDocuments();
      const totalComments = await CommentModel.countDocuments();

      res.status(200).json({
        success: true,
        categories,
        tags,
        totalPosts,
        totalComments,
      });
    } else {
      const meta = await dbStore.getMetadata();
      res.status(200).json({
        success: true,
        ...meta,
      });
    }
  } catch (error) {
    next(error);
  }
};
