import jwt from 'jsonwebtoken';
import ApiToken from '../models/ApiToken.js';
import User from '../models/User.js';

// API Token Authentication middleware
export const apiTokenAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    console.log('🔑 API Token Auth Middleware - Headers:', {
      authorization: authHeader ? `${authHeader.substring(0, 30)}...` : 'none',
      path: req.path,
      method: req.method
    });
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ API Token Auth failed: No token or invalid format');
      return res.status(401).json({ 
        message: 'Access denied. No token provided or invalid format.',
        error: 'Something went wrong',
        timestamp: new Date().toISOString()
      });
    }

    // Extract token from "Bearer TOKEN"
    const token = authHeader.substring(7);
    
    // Check if it's an API token (starts with epd_)
    if (!token.startsWith('epd_')) {
      console.log('❌ Not an API token format');
      return res.status(401).json({ 
        message: 'Access denied. Invalid token format.',
        error: 'Something went wrong',
        timestamp: new Date().toISOString()
      });
    }

    // Find the API token in database
    const apiToken = await ApiToken.findOne({ token }).populate('createdBy');
    
    if (!apiToken) {
      console.log('❌ API token not found in database');
      return res.status(401).json({ 
        message: 'Access denied. Invalid token.',
        error: 'Something went wrong',
        timestamp: new Date().toISOString()
      });
    }

    // Check if token is valid (active and not expired)
    if (!apiToken.isValid()) {
      console.log('❌ API token is invalid or expired');
      return res.status(401).json({ 
        message: 'Access denied. Token is inactive or expired.',
        error: 'Something went wrong',
        timestamp: new Date().toISOString()
      });
    }

    // Check permissions for write operations
    const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    if (isWriteOperation && !apiToken.permissions.includes('write') && !apiToken.permissions.includes('admin')) {
      console.log('❌ API token lacks write permissions');
      return res.status(403).json({ 
        message: 'Access denied. Token does not have write permissions.',
        error: 'Insufficient permissions',
        timestamp: new Date().toISOString()
      });
    }

    console.log('✅ API Token verified successfully:', {
      tokenName: apiToken.name,
      userId: apiToken.createdBy._id,
      permissions: apiToken.permissions
    });

    // Update last used timestamp and usage count
    const clientIp = req.ip || req.connection.remoteAddress;
    await apiToken.updateLastUsed(clientIp);

    // Attach user info to request object (from token creator)
    req.user = {
      id: apiToken.createdBy._id,
      role: apiToken.createdBy.role,
      isAdmin: apiToken.createdBy.isAdmin,
      email: apiToken.createdBy.email,
      name: apiToken.createdBy.name,
      apiTokenId: apiToken._id,
      apiTokenName: apiToken.name,
      permissions: apiToken.permissions
    };
    req.userId = apiToken.createdBy._id;
    req.isApiToken = true;

    next();
  } catch (error) {
    console.error('❌ API Token Auth error:', error);
    return res.status(500).json({ 
      message: 'Internal server error during authentication.',
      error: 'Something went wrong',
      timestamp: new Date().toISOString()
    });
  }
};

// Authentication middleware to verify JWT tokens
export const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    console.log('🔐 Auth Middleware - Headers:', {
      authorization: authHeader ? `${authHeader.substring(0, 20)}...` : 'none',
      path: req.path,
      method: req.method
    });
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Auth failed: No token or invalid format');
      return res.status(401).json({ 
        message: 'Access denied. No token provided or invalid format.' 
      });
    }

    // Extract token from "Bearer TOKEN"
    const token = authHeader.substring(7);

    // Verify token (read JWT_SECRET at runtime)
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    console.log('🔑 Verifying token with secret:', {
      configured: !!process.env.JWT_SECRET,
      preview: JWT_SECRET.substring(0, 20) + '...'
    });
    const decoded = jwt.verify(token, JWT_SECRET);

    console.log('✅ Token verified successfully for user:', decoded.id);

    // Attach user info to request object
    req.user = decoded;
    req.userId = decoded.id || decoded._id;

    next();
  } catch (error) {
    console.log('❌ Auth error:', error.name, error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Access denied. Token has expired.' 
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Access denied. Invalid token.' 
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ 
        message: 'Internal server error during authentication.' 
      });
    }
  }
};

// Optional authentication middleware - doesn't fail if no token provided
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      req.user = null;
      req.userId = null;
      return next();
    }

    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    req.userId = decoded.id || decoded._id;

    next();
  } catch (error) {
    // If token is invalid, continue without authentication instead of failing
    req.user = null;
    req.userId = null;
    next();
  }
};

// Admin-only middleware (requires authentication first)
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Access denied. Authentication required.' 
    });
  }

  if (!req.user.isAdmin && req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. Admin privileges required.' 
    });
  }

  next();
};

// Combined auth + admin middleware
export const adminAuth = [auth, requireAdmin];

// Flexible authentication - supports both API tokens and JWT tokens
export const flexibleAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided or invalid format.',
        error: 'Something went wrong',
        timestamp: new Date().toISOString()
      });
    }

    const token = authHeader.substring(7);
    
    // Check if it's an API token (starts with epd_)
    if (token.startsWith('epd_')) {
      // Use API token authentication
      return apiTokenAuth(req, res, next);
    } else {
      // Use JWT authentication
      return auth(req, res, next);
    }
  } catch (error) {
    console.error('❌ Flexible Auth error:', error);
    return res.status(500).json({ 
      message: 'Internal server error during authentication.',
      error: 'Something went wrong',
      timestamp: new Date().toISOString()
    });
  }
};
