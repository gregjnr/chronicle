import mongoose, { Document, Schema } from 'mongoose';
import { IComment } from '../types.js';

export interface ICommentDocument extends Document, Omit<IComment, '_id' | 'post' | 'author'> {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
}

const CommentSchema = new Schema<ICommentDocument>(
  {
    content: {
      type: String,
      required: [true, 'Please provide comment text'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Comment must belong to a post'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must have an author'],
    },
  },
  {
    timestamps: true,
  }
);

export const CommentModel =
  mongoose.models.Comment || mongoose.model<ICommentDocument>('Comment', CommentSchema);
export default CommentModel;
