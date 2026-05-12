// ---------------------------------------------------------------------------
// Test Setup – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Configures the test environment before tests run.
// ---------------------------------------------------------------------------

process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.JWT_SECRET = 'test_secret_key_for_testing';
process.env.JWT_EXPIRY = '1h';

// Use test database to avoid polluting dev data
process.env.DB_NAME = process.env.DB_NAME || 'auction_db_test';
process.env.DB_USER = process.env.DB_USER || 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'root';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
