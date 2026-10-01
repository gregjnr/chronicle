import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types.js';
import { dbStore } from '../services/dbStore.js';
import UserModel from '../models/User.js';
import { getIsMongoConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chronicle_jwt_secret_dev_key_2026_super_secure';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. No token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication failed. Malformed authorization token.',
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email?: string; name?: string };

    let user: any = null;
    if (getIsMongoConnected()) {
      user = await UserModel.findById(decoded.id).select('-password');
    } else {
      user = await dbStore.findUserById(decoded.id);
    }

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'The user belonging to this token no longer exists.',
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'Your session has expired. Please log in again.',
      });
      return;
    }
    res.status(401).json({
      success: false,
      error: 'Invalid authentication token.',
    });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        let user: any = null;
        if (getIsMongoConnected()) {
          user = await UserModel.findById(decoded.id);
        } else {
          user = await dbStore.findUserById(decoded.id);
        }
        if (user) {
          req.user = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        }
      }
    }
    next();
  } catch {
    // Silently continue without authenticated user
    next();
  }
};
