import mongoose from 'mongoose';

// Middleware to check if database is connected
const dbConnectionCheck = (req, res, next) => {
  // Add database connection status to request object
  req.dbConnected = mongoose.connection.readyState === 1;
  
  // Log connection status for debugging
  if (!req.dbConnected) {
    console.warn(`Database not connected for ${req.method} ${req.path}. Connection state: ${mongoose.connection.readyState}`);
  }
  
  // Continue to next middleware regardless of database status
  // Individual controllers can handle database unavailability
  next();
};

export default dbConnectionCheck;