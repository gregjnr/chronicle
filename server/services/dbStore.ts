import bcrypt from 'bcryptjs';
import { IUser, IPost, IComment } from '../types.js';

/**
 * Robust database storage service providing in-memory & persistent collections.
 * Mirrors Mongoose operations so the app works seamlessly in any environment.
 */
class MemoryDatabase {
  public users: Map<string, IUser> = new Map();
  public posts: Map<string, IPost> = new Map();
  public comments: Map<string, IComment> = new Map();
  public isInitialized = false;

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  }

  // --- USER OPERATIONS ---
  async createUser(data: { name: string; email: string; password?: string; avatar?: string; bio?: string }): Promise<IUser> {
    const existing = await this.findUserByEmail(data.email);
    if (existing) {
      throw new Error('User already exists with this email address');
    }

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;
    const now = new Date();
    const id = this.generateId();

    const user: IUser = {
      _id: id,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      bio: data.bio || 'Writer and reader on Chronicle.',
      createdAt: now,
      updatedAt: now,
      async comparePassword(candidate: string) {
        if (!this.password) return false;
        return bcrypt.compare(candidate, this.password);
      },
    };

    this.users.set(id, user);
    return user;
  }

  async findUserById(id: string): Promise<IUser | null> {
    const user = this.users.get(id);
    if (!user) return null;
    return {
      ...user,
      async comparePassword(candidate: string) {
        if (!user.password) return false;
        return bcrypt.compare(candidate, user.password);
      },
    };
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const normalized = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) {
        return {
          ...user,
          async comparePassword(candidate: string) {
            if (!user.password) return false;
            return bcrypt.compare(candidate, user.password);
          },
        };
      }
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    this.users.set(id, updated);
    return updated;
  }

  // --- POST OPERATIONS ---
  async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    category: string;
    tags: string[];
    authorId: string;
  }): Promise<IPost> {
    const author = await this.findUserById(data.authorId);
    if (!author) throw new Error('Author not found');

    const now = new Date();
    const id = this.generateId();

    const wordCount = data.content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    const excerpt = data.excerpt || data.content.substring(0, 160).replace(/\n/g, ' ') + '...';

    const post: IPost = {
      _id: id,
      title: data.title,
      content: data.content,
      excerpt,
      coverImage: data.coverImage || '',
      category: data.category,
      tags: data.tags || [],
      author: {
        _id: author._id,
        name: author.name,
        email: author.email,
        avatar: author.avatar,
        bio: author.bio,
        createdAt: author.createdAt,
        updatedAt: author.updatedAt,
      },
      views: 0,
      readingTime,
      createdAt: now,
      updatedAt: now,
    };

    this.posts.set(id, post);
    return post;
  }

  async findPosts(options: {
    search?: string;
    category?: string;
    tag?: string;
    authorId?: string;
    sort?: 'newest' | 'oldest' | 'views';
    page?: number;
    limit?: number;
  }): Promise<{ posts: IPost[]; totalPosts: number; totalPages: number; currentPage: number }> {
    let all = Array.from(this.posts.values());

    // Search filter
    if (options.search) {
      const q = options.search.toLowerCase();
      all = all.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (options.category && options.category !== 'All') {
      all = all.filter((p) => p.category.toLowerCase() === options.category!.toLowerCase());
    }

    // Tag filter
    if (options.tag) {
      all = all.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === options.tag!.toLowerCase())
      );
    }

    // Author filter
    if (options.authorId) {
      all = all.filter((p) => {
        const authorId = typeof p.author === 'string' ? p.author : p.author._id;
        return authorId === options.authorId;
      });
    }

    // Sorting
    all.sort((a, b) => {
      if (options.sort === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (options.sort === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      // default newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const totalPosts = all.length;
    const page = options.page || 1;
    const limit = options.limit || 6;
    const totalPages = Math.max(1, Math.ceil(totalPosts / limit));
    const startIndex = (page - 1) * limit;
    const paginatedPosts = all.slice(startIndex, startIndex + limit);

    return {
      posts: paginatedPosts,
      totalPosts,
      totalPages,
      currentPage: page,
    };
  }

  async findPostById(id: string): Promise<IPost | null> {
    const post = this.posts.get(id);
    if (!post) return null;
    return post;
  }

  async incrementPostViews(id: string): Promise<void> {
    const post = this.posts.get(id);
    if (post) {
      post.views = (post.views || 0) + 1;
    }
  }

  async updatePost(
    id: string,
    data: Partial<{
      title: string;
      content: string;
      excerpt: string;
      coverImage: string;
      category: string;
      tags: string[];
    }>
  ): Promise<IPost | null> {
    const post = this.posts.get(id);
    if (!post) return null;

    if (data.content && data.content !== post.content) {
      const wordCount = data.content.trim().split(/\s+/).length;
      post.readingTime = Math.max(1, Math.ceil(wordCount / 200));
      if (!data.excerpt) {
        post.excerpt = data.content.substring(0, 160).replace(/\n/g, ' ') + '...';
      }
    }

    if (data.title) post.title = data.title;
    if (data.content) post.content = data.content;
    if (data.excerpt !== undefined) post.excerpt = data.excerpt;
    if (data.coverImage !== undefined) post.coverImage = data.coverImage;
    if (data.category) post.category = data.category;
    if (data.tags) post.tags = data.tags;
    post.updatedAt = new Date();

    this.posts.set(id, post);
    return post;
  }

  async deletePost(id: string): Promise<boolean> {
    const deleted = this.posts.delete(id);
    if (deleted) {
      // Cascade delete comments
      for (const [commentId, comment] of this.comments.entries()) {
        if (comment.post === id) {
          this.comments.delete(commentId);
        }
      }
    }
    return deleted;
  }

  // --- COMMENT OPERATIONS ---
  async addComment(data: { content: string; postId: string; authorId: string }): Promise<IComment> {
    const author = await this.findUserById(data.authorId);
    if (!author) throw new Error('Comment author not found');

    const post = await this.findPostById(data.postId);
    if (!post) throw new Error('Post not found');

    const id = this.generateId();
    const now = new Date();

    const comment: IComment = {
      _id: id,
      content: data.content,
      post: data.postId,
      author: {
        _id: author._id,
        name: author.name,
        email: author.email,
        avatar: author.avatar,
        bio: author.bio,
        createdAt: author.createdAt,
        updatedAt: author.updatedAt,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.comments.set(id, comment);
    return comment;
  }

  async findCommentsByPost(postId: string): Promise<IComment[]> {
    const results: IComment[] = [];
    for (const comment of this.comments.values()) {
      if (comment.post === postId) {
        results.push(comment);
      }
    }
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findCommentById(id: string): Promise<IComment | null> {
    return this.comments.get(id) || null;
  }

  async deleteComment(id: string): Promise<boolean> {
    return this.comments.delete(id);
  }

  async countCommentsForPost(postId: string): Promise<number> {
    let count = 0;
    for (const comment of this.comments.values()) {
      if (comment.post === postId) count++;
    }
    return count;
  }

  async getMetadata() {
    const categoriesMap = new Map<string, number>();
    const tagsMap = new Map<string, number>();

    for (const post of this.posts.values()) {
      categoriesMap.set(post.category, (categoriesMap.get(post.category) || 0) + 1);
      for (const tag of post.tags) {
        tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
      }
    }

    return {
      categories: Array.from(categoriesMap.entries()).map(([name, count]) => ({ name, count })),
      tags: Array.from(tagsMap.entries()).map(([name, count]) => ({ name, count })),
      totalPosts: this.posts.size,
      totalUsers: this.users.size,
      totalComments: this.comments.size,
    };
  }
}

export const dbStore = new MemoryDatabase();
