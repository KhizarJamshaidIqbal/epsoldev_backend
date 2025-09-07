import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { registerRoutes } from './routes/index.js';
import dbConnectionCheck from './middleware/dbConnectionCheck.js';

// Configure path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
let isDbConnected = false;
try {
  isDbConnected = await connectDB();
} catch (error) {
  console.error('Database connection failed:', error);
  // Continue without database connection for now
}

// Core middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080', 
    'http://localhost:3000',
    'http://localhost:4173',
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    'https://epsoldev.com',
    'https://*.vercel.app'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection check middleware
app.use('/api', dbConnectionCheck);

// API routes
try {
  registerRoutes(app);
} catch (error) {
  console.error('Error registering routes:', error);
  console.log('Starting server with basic routes only');
}

// Root endpoint for Vercel
app.get('/', (req, res) => {
  res.json({
    message: 'EpsolDev API Server - Root Endpoint',
    version: '1.0.0',
    status: isDbConnected ? 'connected' : 'database unavailable',
    timestamp: new Date().toISOString(),
    endpoints: {
      api: '/api',
      health: '/api/health',
      test: '/api/test',
      technologies: '/api/technologies'
    }
  });
});

// Basic fallback routes
app.get('/api', (req, res) => {
  res.json({
    message: 'EpsolDev API Server',
    version: '1.0.0',
    status: isDbConnected ? 'connected' : 'database unavailable',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for Vercel deployment
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Vercel deployment test successful!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      '/api',
      '/api/health',
      '/api/test',
      '/api/auth',
      '/api/blog',
      '/api/technologies',
      '/api/services',
      '/api/portfolio'
    ]
  });
});

// Start server (only in development or when not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Database: ${isDbConnected ? 'Connected' : 'Disconnected'}`);
    console.log(`🌐 CORS enabled for multiple origins: 5173, 8080, 3000, 4173`);
  });
}

export default app;
