const { sequelize } = require('../config/db');

// ---------------------------------------------------------------------------
// Model Registry – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Central file that imports every model and defines associations.
// server.js only needs to require this single file.
//
// When you add a new model:
//   1. Create the model file (e.g. src/models/Auction.js)
//   2. Import it below
//   3. Define its associations in the ASSOCIATIONS section
// ---------------------------------------------------------------------------

// ========================  MODEL IMPORTS  ========================

const User = require('./User');
// const Auction = require('./Auction');  // future
// const Bid     = require('./Bid');      // future

// ========================  ASSOCIATIONS  =========================
// Define all relationships here so every model is fully loaded first.
// This avoids circular-dependency issues.

// --- Future associations (uncomment when models are created) ---

// User ↔ Auction  (a seller lists many auctions)
// User.hasMany(Auction,    { foreignKey: 'seller_id', as: 'auctions' });
// Auction.belongsTo(User,  { foreignKey: 'seller_id', as: 'seller'   });

// User ↔ Bid  (a buyer places many bids)
// User.hasMany(Bid,        { foreignKey: 'bidder_id', as: 'bids'     });
// Bid.belongsTo(User,      { foreignKey: 'bidder_id', as: 'bidder'   });

// Auction ↔ Bid  (an auction receives many bids)
// Auction.hasMany(Bid,     { foreignKey: 'auction_id', as: 'bids'    });
// Bid.belongsTo(Auction,   { foreignKey: 'auction_id', as: 'auction' });

// ========================  SYNC HELPER  ==========================

/**
 * Environment-aware database sync.
 *
 * | NODE_ENV    | Strategy         | Effect                             |
 * |-------------|------------------|------------------------------------|
 * | development | alter: true      | adds new columns, keeps data       |
 * | test        | force: true      | drops & recreates every run        |
 * | production  | sync (no flags)  | creates missing tables, no alter   |
 *
 * @returns {Promise<void>}
 */
const syncDatabase = async () => {
  const env = process.env.NODE_ENV || 'development';

  console.log(`⚙️   Sync strategy: ${env}`);

  try {
    switch (env) {
      case 'development':
        // Alter tables to match model changes — safe, preserves data
        await sequelize.sync({ alter: true });
        console.log('📦  Models synchronised (alter mode).');
        break;

      case 'test':
        // Drop and recreate — clean slate for every test run
        await sequelize.sync({ force: true });
        console.log('📦  Models synchronised (force mode – test only).');
        break;

      case 'production':
        // Only create tables that don't exist — never alter or drop
        await sequelize.sync();
        console.log('📦  Models synchronised (safe mode – production).');
        break;

      default:
        await sequelize.sync();
        console.log('📦  Models synchronised (default safe mode).');
    }

    // Log all registered tables
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log(`📋  Tables in database: ${tables.join(', ') || '(none)'}`);
  } catch (error) {
    console.error('❌  Database sync failed:', error.message);
    process.exit(1);
  }
};

// ========================  EXPORTS  ==============================

module.exports = {
  sequelize,
  syncDatabase,
  User,
  // Auction,  // export future models here
  // Bid,
};
