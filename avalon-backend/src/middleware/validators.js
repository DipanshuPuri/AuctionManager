const { body, validationResult } = require('express-validator');

// ---------------------------------------------------------------------------
// Validation Middleware – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Reusable validation chains + a shared error-handler middleware.
// Import the chain you need and append `validate` at the end of the array.
//
// Usage in routes:
//   router.post('/signup', signupRules, validate, signup);
// ---------------------------------------------------------------------------

/**
 * Generic error-handler that runs after express-validator chains.
 * Returns 400 with a structured errors array if any rule failed.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  return next();
};

// ========================  AUTH RULES  ========================

const signupRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

  body('role')
    .optional()
    .isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller.'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.'),
];

module.exports = { validate, signupRules, loginRules };
