const jwt = require('jsonwebtoken');

// ---------------------------------------------------------------------------
// Auth Middleware – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Validates the JWT sent in the Authorization header and attaches the decoded
// payload ({ id, role }) to `req.user` for downstream controllers.
//
// Usage:
//   const { authenticate } = require('../middleware/authMiddleware');
//   router.get('/me', authenticate, authController.getCurrentUser);
//
//   // Role-restricted route
//   const { authorize } = require('../middleware/authMiddleware');
//   router.post('/auctions', authenticate, authorize('seller'), ...);
// ---------------------------------------------------------------------------

/**
 * Core JWT authentication middleware.
 * Expects: `Authorization: Bearer <token>`
 */
const authenticate = (req, res, next) => {
  try {
    // ---- 1. Extract token ----
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token is malformed.',
      });
    }

    // ---- 2. Verify token ----
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ---- 3. Attach payload to request ----
    req.user = decoded; // { id, role, iat, exp }

    return next();
  } catch (error) {
    // jwt.verify throws specific error types we can distinguish
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Authentication failed.',
      });
    }

    if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        message: 'Token is not yet active.',
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    });
  }
};

/**
 * Role-based authorization middleware factory.
 * Must be used AFTER `authenticate`.
 *
 * @param  {...string} allowedRoles – one or more roles (e.g. 'seller', 'buyer')
 * @returns {Function} Express middleware
 *
 * @example
 *   router.post('/auctions', authenticate, authorize('seller'), createAuction);
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required before authorization.',
    });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Required role(s): ${allowedRoles.join(', ')}.`,
    });
  }

  return next();
};

module.exports = { authenticate, authorize };
