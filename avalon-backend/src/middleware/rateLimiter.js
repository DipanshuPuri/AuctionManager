const rateLimit = require('express-rate-limit');

// ---------------------------------------------------------------------------
// Rate Limiter Middleware – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Pre-configured rate limiters for different route categories.
// ---------------------------------------------------------------------------

/**
 * Auth routes limiter — prevents brute-force login/signup attacks.
 * 10 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Bidding routes limiter — prevents bid spamming.
 * 30 requests per minute per IP.
 */
const bidLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    success: false,
    message: 'Too many bid attempts. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API limiter — applied globally as a safety net.
 * 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, bidLimiter, generalLimiter };
