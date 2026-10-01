import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types.js';

export interface IUserDocument extends Document, Omit<IUser, '_id'> {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
          this.name || 'ChronicleUser'
        )}`;
      },
    },
    bio: {
      type: String,
      default: 'Writer and reader on Chronicle.',
      maxlength: [200, 'Bio cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
UserSchema.pre('save', async function (this: any) {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password helper
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
export default UserModel;
