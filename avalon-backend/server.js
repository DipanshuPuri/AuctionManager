const express = require('express');
require('dotenv').config();

const { sequelize, connectDB } = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Core middleware ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Routes ----
const authRoutes = require('./src/routes/authRoutes');

app.get('/', (_req, res) => {
  res.json({ status: 'ok', app: 'Avalon – AuctionManager API' });
});

app.use('/api/auth', authRoutes);

// ---- Bootstrap ----
const startServer = async () => {
  // 1. Verify database connection
  await connectDB();

  // 2. Sync models (safe in dev – use migrations in production)
  await sequelize.sync({ alter: false });
  console.log('📦  All models synchronised.');

  // 3. Start listening
  app.listen(PORT, () => {
    console.log(`🚀  Avalon server running on http://localhost:${PORT}`);
  });
};

startServer();
