import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types.js';
import { dbStore } from '../services/dbStore.js';
import UserModel from '../models/User.js';
import { getIsMongoConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chronicle_jwt_secret_dev_key_2026_super_secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const createToken = (id: string, email: string, name: string): string => {
  return jwt.sign({ id, email, name }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, avatar, bio } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Name is required' });
      return;
    }
    if (!email || !email.trim()) {
      res.status(400).json({ success: false, error: 'Email is required' });
      return;
    }
    if (!password || password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
      });
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, error: 'Please provide a valid email address' });
      return;
    }

    if (getIsMongoConnected()) {
      const existing = await UserModel.findOne({ email: email.toLowerCase() });
      if (existing) {
        res.status(400).json({ success: false, error: 'An account with that email already exists' });
        return;
      }

      const user = await UserModel.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        avatar: avatar || undefined,
        bio: bio || undefined,
      });

      const token = createToken(user._id.toString(), user.email, user.name);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      });
    } else {
      const existing = await dbStore.findUserByEmail(email);
      if (existing) {
        res.status(400).json({ success: false, error: 'An account with that email already exists' });
        return;
      }

      const user = await dbStore.createUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        avatar: avatar || undefined,
        bio: bio || undefined,
      });

      const token = createToken(user._id, user.email, user.name);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Please provide both email and password',
      });
      return;
    }

    if (getIsMongoConnected()) {
      const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        res.status(401).json({ success: false, error: 'Invalid email or password' });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ success: false, error: 'Invalid email or password' });
        return;
      }

      const token = createToken(user._id.toString(), user.email, user.name);

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      });
    } else {
      const user = await dbStore.findUserByEmail(email);
      if (!user) {
        res.status(401).json({ success: false, error: 'Invalid email or password' });
        return;
      }

      const isMatch = await user.comparePassword!(password);
      if (!isMatch) {
        res.status(401).json({ success: false, error: 'Invalid email or password' });
        return;
      }

      const token = createToken(user._id, user.email, user.name);

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authorized' });
      return;
    }

    if (getIsMongoConnected()) {
      const user = await UserModel.findById(req.user.id).select('-password');
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
      res.status(200).json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      });
    } else {
      const user = await dbStore.findUserById(req.user.id);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authorized' });
      return;
    }

    const { name, bio, avatar } = req.body;
    const updates: any = {};
    if (name) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio.trim();
    if (avatar) updates.avatar = avatar.trim();

    if (getIsMongoConnected()) {
      const updated = await UserModel.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true,
      }).select('-password');

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updated!._id.toString(),
          name: updated!.name,
          email: updated!.email,
          avatar: updated!.avatar,
          bio: updated!.bio,
        },
      });
    } else {
      const updated = await dbStore.updateUser(req.user.id, updates);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updated!._id,
          name: updated!.name,
          email: updated!.email,
          avatar: updated!.avatar,
          bio: updated!.bio,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
