import mongoose from 'mongoose';

let isConnected = false;

export const connectToMongo = async (uri: string): Promise<void> => {
  if (isConnected) return;

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  console.log('✅ Connected to MongoDB');
};

export const disconnectFromMongo = async (): Promise<void> => {
  if (!isConnected) return;

  await mongoose.disconnect();

  isConnected = false;
};
