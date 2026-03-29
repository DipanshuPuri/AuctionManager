// ---------------------------------------------------------------------------
// Socket.IO Handler – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Central place for all WebSocket event registration.
// As the app grows, split handlers into separate files and import them here:
//
//   const registerAuctionEvents = require('./auctionSocket');
//   const registerBidEvents     = require('./bidSocket');
//
//   registerAuctionEvents(io);
//   registerBidEvents(io);
// ---------------------------------------------------------------------------

/**
 * Initialise Socket.IO event listeners.
 * @param {import('socket.io').Server} io – Socket.IO server instance
 */
const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌  Client connected: ${socket.id}`);

    // ---- Test event (for verification / academic demo) ----
    socket.on('testEvent', (data) => {
      console.log(`📨  testEvent received from ${socket.id}:`, data);

      // Send confirmation back to the sender
      socket.emit('testResponse', {
        success: true,
        message: 'Server received your event.',
        received: data,
        timestamp: new Date().toISOString(),
      });
    });

    // ---- Future events — add below as modules are built ----
    // socket.on('joinAuction', (auctionId) => { ... });
    // socket.on('placeBid',    (bidData)   => { ... });

    // ---- Disconnect ----
    socket.on('disconnect', (reason) => {
      console.log(`❌  Client disconnected: ${socket.id} (${reason})`);
    });
  });
};

module.exports = initSocket;
