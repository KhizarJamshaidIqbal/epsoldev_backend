import mongoose from 'mongoose';

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khizarjamshaidiqbal:uJLam6FepeeYgpWL@cluster0.ygxxdws.mongodb.net/epsoldev?retryWrites=true&w=majority&appName=Cluster0';
  
  try {
    // Configure mongoose for serverless environment
    mongoose.set('strictQuery', false);
    
    // Connection options optimized for Vercel serverless
    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    };
    
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Starting server without database connection');
    return false;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

export default connectDB;
