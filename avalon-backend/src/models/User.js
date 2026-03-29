const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// ---------------------------------------------------------------------------
// User model – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Represents a platform user who can act as a buyer, seller, or both (future).
// Designed to support upcoming associations:
//   • User.hasMany(Auction)   – a seller lists auctions
//   • User.hasMany(Bid)       – a buyer places bids
// ---------------------------------------------------------------------------

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'Name is required.' },
      notEmpty: { msg: 'Name cannot be empty.' },
      len: {
        args: [2, 100],
        msg: 'Name must be between 2 and 100 characters.',
      },
    },
  },

  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      name: 'users_email_unique',
      msg: 'A user with this email already exists.',
    },
    validate: {
      notNull: { msg: 'Email is required.' },
      notEmpty: { msg: 'Email cannot be empty.' },
      isEmail: { msg: 'Must be a valid email address.' },
    },
  },

  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: { msg: 'Password hash is required.' },
      notEmpty: { msg: 'Password hash cannot be empty.' },
    },
  },

  role: {
    type: DataTypes.ENUM('buyer', 'seller'),
    allowNull: false,
    defaultValue: 'buyer',
    validate: {
      isIn: {
        args: [['buyer', 'seller']],
        msg: 'Role must be either buyer or seller.',
      },
    },
  },
}, {
  // timestamps: true & underscored: true are inherited from the global
  // `define` options in src/config/db.js, so created_at / updated_at
  // columns are added automatically.
});

module.exports = User;
