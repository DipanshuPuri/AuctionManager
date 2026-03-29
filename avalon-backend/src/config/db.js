const { Sequelize } = require('sequelize');
require('dotenv').config();

// ---------------------------------------------------------------------------
// Database configuration – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Reads credentials from environment variables so nothing sensitive is
// hard-coded.  The connection is validated eagerly via `authenticate()` which
// is exported as a helper for the server bootstrap.
// ---------------------------------------------------------------------------

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,

    // ----------  connection-pool (production-ready defaults)  ----------
    pool: {
      max: 10,       // max simultaneous connections
      min: 0,        // min connections kept open
      acquire: 30000, // ms – max time to acquire a connection before throwing
      idle: 10000,    // ms – max time a connection can be idle before release
    },

    // ----------  additional safeguards  ----------
    define: {
      timestamps: true,   // createdAt / updatedAt on every model by default
      underscored: true,  // use snake_case column names (auction_id, not auctionId)
      freezeTableName: true,
    },
  },
);

/**
 * Test the database connection and log the result.
 * Call this once during server startup.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅  Database connection established successfully.');
  } catch (error) {
    console.error('❌  Unable to connect to the database:', error.message);
    process.exit(1); // exit so the process manager can restart cleanly
  }
};

module.exports = { sequelize, connectDB };
