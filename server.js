import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { registerRoutes } from './routes/index.js';


const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5000;

// Configure path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
const envPath = path.join(__dirname, '.env');
console.log('📁 Loading .env from:', envPath);
dotenv.config({ path: envPath });
console.log('✅ Environment loaded. JWT_SECRET exists:', !!process.env.JWT_SECRET);

// Create Express app
const app = express();
// const PORT = process.env.PORT || 5000;

// Connect to MongoDB
let isDbConnected = false;
try {
  isDbConnected = await connectDB();
} catch (error) {
  console.error('Database connection failed:', error);
  // Continue without database connection for now
}

// Core middleware - CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080', 
  'http://localhost:3000',
  'http://localhost:4173',
  'https://epsoldev.com',
  'https://www.epsoldev.com',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
].filter(Boolean);

// CORS configuration using cors package only
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin matches allowed origins
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS: Allowing origin:', origin);
      return callback(null, true);
    }
    
    // Allow Vercel preview deployments
    if (origin.endsWith('.vercel.app')) {
      console.log('✅ CORS: Allowing Vercel deployment:', origin);
      return callback(null, true);
    }
    
    // Block all other origins
    console.warn('⚠️ CORS blocked origin:', origin);
    console.warn('Allowed origins:', allowedOrigins);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  preflightContinue: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
// if (process.env.NODE_ENV !== 'production') {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//     console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
//     console.log(`🔗 Database: ${isDbConnected ? 'Connected' : 'Disconnected'}`);
//     console.log(`🌐 CORS enabled for multiple origins: 5173, 8080, 3000, 4173`);
//   });
// }
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database: ${isDbConnected ? 'Connected' : 'Disconnected'}`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ') || '(no explicit origins)'}`);
});

export default app;
