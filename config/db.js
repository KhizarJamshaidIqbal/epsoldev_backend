import mongoose from 'mongoose';

const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
  
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
