import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise<boolean>} - Returns true if connection is successful
 */
export const connectToDatabase = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
  
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