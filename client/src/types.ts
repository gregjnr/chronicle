export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  views: number;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  success: boolean;
  posts: Post[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}
