const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// ---------------------------------------------------------------------------
// Bid model – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Represents a single bid placed by a buyer on an auction.
// Associations (defined in models/index.js):
//   • Bid.belongsTo(User)      – the bidder
//   • Bid.belongsTo(Auction)   – the auction being bid on
// ---------------------------------------------------------------------------

const Bid = sequelize.define('bids', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },

  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      notNull: { msg: 'Bid amount is required.' },
      isDecimal: { msg: 'Bid amount must be a valid number.' },
      min: {
        args: [0.01],
        msg: 'Bid amount must be greater than zero.',
      },
    },
  },

  auction_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'auctions',
      key: 'id',
    },
  },

  bidder_id: {
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

module.exports = Bid;
