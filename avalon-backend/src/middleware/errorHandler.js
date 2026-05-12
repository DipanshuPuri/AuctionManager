// ---------------------------------------------------------------------------
// Global Error Handler – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Catches all unhandled errors from route handlers and middleware.
// Returns a consistent JSON response format.
// ---------------------------------------------------------------------------

const errorHandler = (err, req, res, _next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error.';
  let errors = null;

  // ---- Sequelize Validation Errors ----
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation failed.';
    errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ---- Sequelize Unique Constraint ----
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'A record with this value already exists.';
    errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ---- Sequelize Database Error ----
  if (err.name === 'SequelizeDatabaseError') {
    statusCode = 400;
    message = 'Database error. Please check your input.';
  }

  // ---- JWT Errors ----
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired.';
  }

  // ---- Multer Errors ----
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large. Maximum size is 5MB.';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field.';
  }

  // ---- Multer file filter error ----
  if (err.message && err.message.startsWith('Invalid file type')) {
    statusCode = 400;
  }

  // ---- Log errors in development ----
  if (process.env.NODE_ENV === 'development') {
    console.error('❌  Error:', {
      statusCode,
      message,
      stack: err.stack,
    });
  } else {
    // In production, don't expose stack traces
    console.error('❌  Error:', message);
  }

  // ---- Send response ----
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  // Include stack trace in development only
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
