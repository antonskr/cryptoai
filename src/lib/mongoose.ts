// src/lib/mongoose.ts
import mongoose from 'mongoose';

const connectMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(process.env.MONGODB_URI!);
};

export default connectMongo;