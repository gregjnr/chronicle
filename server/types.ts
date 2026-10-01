import { Request } from 'express';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword?(candidatePassword: string): Promise<boolean>;
}

export interface IPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: IUser | string;
  views: number;
  readingTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  content: string;
  post: string;
  author: IUser | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}
