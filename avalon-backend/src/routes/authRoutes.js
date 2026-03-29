const express = require('express');
const router = express.Router();

const { signup, login, getCurrentUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validate, signupRules, loginRules } = require('../middleware/validators');

// ---------------------------------------------------------------------------
// Auth Routes – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// POST /auth/signup  – register a new user
// POST /auth/login   – authenticate & receive JWT
// GET  /auth/me      – get current logged-in user (protected)
// ---------------------------------------------------------------------------

router.post('/signup', signupRules, validate, signup);
router.post('/login', loginRules, validate, login);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
