const express = require('express');
const router = express.Router();

const { signup, login, getCurrentUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// ---------------------------------------------------------------------------
// Auth Routes – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// POST /auth/signup  – register a new user
// POST /auth/login   – authenticate & receive JWT
// GET  /auth/me      – get current logged-in user (protected)
// ---------------------------------------------------------------------------

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
