import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise<boolean>} - Returns true if connection is successful
 */
export const connectToDatabase = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:2P4AJ689oxziNvE7sI@69.57.161.11:27017/epsoldev?authSource=admin';
  
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// For backward compatibility with imports that use default
const connectDB = connectToDatabase;
export default connectDB; 