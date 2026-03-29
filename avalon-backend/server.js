const express = require('express');
const http = require('http');
require('dotenv').config();

const { Server } = require('socket.io');
const { connectDB } = require('./src/config/db');
const { syncDatabase } = require('./src/models');
const initSocket = require('./src/socket/socketHandler');

// ---------------------------------------------------------------------------
// Avalon – AuctionManager API  |  server.js
// ---------------------------------------------------------------------------

const app = express();
const server = http.createServer(app); // required for Socket.IO
const io = new Server(server, {
  cors: { origin: '*' }, // tighten in production
});
const PORT = process.env.PORT || 5000;

// ========================  MIDDLEWARE  ========================
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================  ROUTES  ============================

// Health-check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', app: 'Avalon – AuctionManager API' });
});

// Auth (REST)
const authRoutes = require('./src/routes/authRoutes');
app.use('/auth', authRoutes);

// Future REST modules — add below as they are built:
// const auctionRoutes = require('./src/routes/auctionRoutes');
// app.use('/auctions', auctionRoutes);
//
// const bidRoutes = require('./src/routes/bidRoutes');
// app.use('/bids', bidRoutes);

// GraphQL
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/graphql/schema');

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

// ========================  SOCKET.IO  =========================

initSocket(io);

// ========================  BOOTSTRAP  =========================

const startServer = async () => {
  // 1. Verify database connection
  await connectDB();

  // 2. Sync models (strategy based on NODE_ENV)
  await syncDatabase();

  // 3. Start listening (use `server`, not `app`, for Socket.IO)
  server.listen(PORT, () => {
    console.log(`🚀  Avalon server running on http://localhost:${PORT}`);
    console.log(`🔌  Socket.IO ready and listening`);
  });
};

startServer();

