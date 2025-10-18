import mongoose from 'mongoose';

const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:2P4AJ689oxziNvE7sI@69.57.161.11:27017/epsoldev?authSource=admin';
  
  console.log('🔍 Attempting to connect to MongoDB...');
  console.log('📍 Connection string:', MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB');
  
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Starting server without database connection');
    return false;
  }
};

export default connectDB; 
