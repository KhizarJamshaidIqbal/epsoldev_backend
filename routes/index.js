import express from 'express';
import authRoutes from './authRoutes.js';
import blogRoutes from './blogRoutes.js';
import commentRoutes from './commentRoutes.js';
import tagRoutes from './tagRoutes.js';
console.log('🔄 Attempting to import technology routes...');
import technologyRoutes from './technologyRoutes.js';
console.log('✅ Technology routes imported successfully');
import serviceRoutes from './serviceRoutes.js';
import portfolioRoutes from './portfolioRoutes.js';
import testimonialRoutes from './testimonialRoutes.js';
import teamRoutes from './teamRoutes.js';
import projectRequestRoutes from './projectRequestRoutes.js';
import contactRoutes from './contactRoutes.js';
import contactDetailsRoutes from './contactDetailsRoutes.js';
import faqRoutes from './faqRoutes.js';
import contentRoutes from './contentRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import apiTokenRoutes from './apiTokenRoutes.js';
import debugRoutes from './debugRoutes.js';
// import dbRoutes from './dbRoutes.js'; // Temporarily disabled

/**
 * Register all API routes with the Express app
 * @param {import('express').Application} app - Express application
 */
export const registerRoutes = (app) => {
  const apiRouter = express.Router();
  
  // Register available API routes
  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/blog', blogRoutes);
  apiRouter.use('/comments', commentRoutes);
  apiRouter.use('/tags', tagRoutes);
  console.log('🔄 Registering technology routes...');
  apiRouter.use('/technologies', technologyRoutes);
  console.log('✅ Technology routes registered successfully');
  apiRouter.use('/services', serviceRoutes);
  apiRouter.use('/portfolio', portfolioRoutes);
  apiRouter.use('/testimonials', testimonialRoutes);
  apiRouter.use('/team', teamRoutes);
  apiRouter.use('/project-requests', projectRequestRoutes);
  apiRouter.use('/contacts', contactRoutes);
  apiRouter.use('/contact-details', contactDetailsRoutes);
  apiRouter.use('/faqs', faqRoutes);
  apiRouter.use('/content', contentRoutes);
  apiRouter.use('/settings', settingsRoutes);
  apiRouter.use('/upload', uploadRoutes);
  apiRouter.use('/api-tokens', apiTokenRoutes);
  apiRouter.use('/debug', debugRoutes);
  // apiRouter.use('/db', dbRoutes); // Temporarily disabled
  
  // Mount all routes under /api
  app.use('/api', apiRouter);
  
  // Response for the root API endpoint
  apiRouter.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the EpsolDev API',
      version: '1.0.0',
      status: 'operational',
      endpoints: {
        auth: '/api/auth',
        blog: '/api/blog',
        comments: '/api/comments',
        tags: '/api/tags',
        technologies: '/api/technologies',
        services: '/api/services',
        portfolio: '/api/portfolio',
        testimonials: '/api/testimonials',
        team: '/api/team',
        projectRequests: '/api/project-requests',
        contacts: '/api/contacts',
        contactDetails: '/api/contact-details',
        faqs: '/api/faqs',
        content: '/api/content',
        settings: '/api/settings',
        upload: '/api/upload',
        apiTokens: '/api/api-tokens',
        health: '/api/health'
      },
      timestamp: new Date().toISOString()
    });
  });

  // Health check endpoint
  apiRouter.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });
  
  console.log('✅ API routes registered successfully');
};