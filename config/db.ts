import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const {
  MONGO_USER_NAME,
  MONGO_USER_PASSWORD,
  MONGO_CLUSTER_URI,
  MONGO_APP_NAME,
} = process.env

if (!MONGO_USER_NAME || !MONGO_USER_PASSWORD || !MONGO_CLUSTER_URI || !MONGO_APP_NAME) {
  console.error('Missing one or more required environment variables: MONGO_USER_NAME, MONGO_USER_PASSWORD, MONGO_CLUSTER_URI, MONGO_APP_NAME');
  process.exit(1);
}

const mongodbUrl = `mongodb+srv://${MONGO_USER_NAME}:${MONGO_USER_PASSWORD}@${MONGO_CLUSTER_URI}/?retryWrites=true&w=majority&appName=${MONGO_APP_NAME}`;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongodbUrl);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', (error as Error).message || error);
    process.exit(1);
  }
};