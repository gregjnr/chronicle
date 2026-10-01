import mongoose from 'mongoose';
import { seedDatabase } from '../seed.js';

let isMongoConnected = false;

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (uri && uri !== 'mongodb://localhost:27017/blog-platform') {
    try {
      console.log('Connecting to MongoDB via Mongoose...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
      });
      isMongoConnected = true;
      console.log('Connected to MongoDB database successfully!');
      return;
    } catch (err: any) {
      console.warn(`MongoDB connection notice: ${err.message}. Initializing seamless resilient store.`);
    }
  }

  // Resilient embedded database initialization & auto-seeding
  console.log('Initializing embedded persistent memory database for Chronicle Blog Platform...');
  await seedDatabase();
  console.log('Chronicle database ready for requests.');
}

export function getIsMongoConnected(): boolean {
  return isMongoConnected;
}
