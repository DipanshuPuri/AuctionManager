const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ---------------------------------------------------------------------------
// Auth Controller – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Handles signup, login, and fetching the current authenticated user.
// Passwords are hashed with bcrypt (12 salt rounds).
// JWTs are signed with a configurable secret and expiry.
// ---------------------------------------------------------------------------

const SALT_ROUNDS = 12;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

/**
 * Generate a signed JWT for the given user.
 * @param {Object} user – Sequelize User instance
 * @returns {string} signed token
 */
const generateToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY },
  );

// ========================  SIGNUP  ========================

const signup = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    // --- basic field validation ---
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, username, email, and password are required.',
      });
    }

    // --- check duplicate username ---
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'This username is already taken.',
      });
    }

    // --- check duplicate email ---
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    // --- hash password & create user ---
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      username,
      email,
      password_hash,
      role: role || 'buyer',
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Sequelize validation errors → 400
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ========================  LOGIN  =========================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- field validation ---
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // --- find user ---
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email.',
      });
    }

    // --- verify password ---
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // --- issue token ---
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ====================  GET CURRENT USER  ==================

const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the auth middleware (JWT verification)
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('GetCurrentUser error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { signup, login, getCurrentUser };
