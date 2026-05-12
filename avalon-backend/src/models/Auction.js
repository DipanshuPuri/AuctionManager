const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// ---------------------------------------------------------------------------
// Auction model – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Represents a single auction listing created by a seller.
// Associations (defined in models/index.js):
//   • Auction.belongsTo(User)   – seller who created the auction
//   • Auction.hasMany(Bid)      – bids placed on the auction
// ---------------------------------------------------------------------------

const Auction = sequelize.define('auctions', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notNull: { msg: 'Title is required.' },
      notEmpty: { msg: 'Title cannot be empty.' },
      len: {
        args: [3, 200],
        msg: 'Title must be between 3 and 200 characters.',
      },
    },
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  starting_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      notNull: { msg: 'Starting price is required.' },
      isDecimal: { msg: 'Starting price must be a valid number.' },
      min: {
        args: [0.01],
        msg: 'Starting price must be greater than zero.',
      },
    },
  },

  current_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      isDecimal: { msg: 'Current price must be a valid number.' },
    },
  },

  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: { msg: 'Image URL must be a valid URL.' },
    },
  },

  status: {
    type: DataTypes.ENUM('upcoming', 'active', 'closed'),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: {
        args: [['upcoming', 'active', 'closed']],
        msg: 'Status must be upcoming, active, or closed.',
      },
    },
  },

  start_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  end_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  seller_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  // timestamps: true & underscored: true are inherited from global define
  // options in src/config/db.js
});

module.exports = Auction;
