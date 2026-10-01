import mongoose, { Document, Schema } from 'mongoose';
import { IPost } from '../types.js';

export interface IPostDocument extends Document, Omit<IPost, '_id' | 'author'> {
  author: mongoose.Types.ObjectId;
}

const PostSchema = new Schema<IPostDocument>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a post title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide post content'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
      enum: [
        'Technology',
        'Design',
        'Development',
        'AI & ML',
        'Career',
        'Lifestyle',
        'Tutorials',
        'Other',
      ],
      default: 'Technology',
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must have an author'],
    },
    views: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate reading time and excerpt before save
PostSchema.pre('save', function (this: any) {
  if (this.isModified('content')) {
    const wordCount = (this.content || '').trim().split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));

    if (!this.excerpt && this.content) {
      this.excerpt = this.content.substring(0, 160).replace(/\n/g, ' ') + '...';
    }
  }
});

export const PostModel = mongoose.models.Post || mongoose.model<IPostDocument>('Post', PostSchema);
export default PostModel;
