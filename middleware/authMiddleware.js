import jwt from 'jsonwebtoken';

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
      res.status(401);
      throw new Error('Access denied. No token provided or invalid format.');
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
      res.status(401);
      return next(new Error('Access denied. Token has expired.'));
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401);
      return next(new Error('Access denied. Invalid token.'));
    } else {
      console.error('Auth middleware error:', error);
      res.status(error.message.includes('Access denied') ? 401 : 500);
      return next(error);
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
    res.status(401);
    return next(new Error('Access denied. Authentication required.'));
  }

  if (!req.user.isAdmin && req.user.role !== 'admin') {
    res.status(403);
    return next(new Error('Access denied. Admin privileges required.'));
  }

  next();
};

// Combined auth + admin middleware
export const adminAuth = [auth, requireAdmin];
