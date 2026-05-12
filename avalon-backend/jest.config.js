module.exports = {
  testEnvironment: 'node',
  setupFilesAfterSetup: ['./tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true,
  verbose: true,
};
