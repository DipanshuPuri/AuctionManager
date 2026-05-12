const express = require('express');
const router = express.Router();

const { placeBid, getBidsByAuction } = require('../controllers/bidController');
const { authenticate } = require('../middleware/authMiddleware');
const { bidRules, validate } = require('../middleware/validators');

// ---------------------------------------------------------------------------
// Bid Routes – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// POST /bids                    – place a new bid (authenticated)
// GET  /bids/auction/:auctionId – get all bids for an auction (public)
// ---------------------------------------------------------------------------

router.post(
  '/',
  authenticate,
  bidRules,
  validate,
  placeBid,
);

router.get('/auction/:auctionId', getBidsByAuction);

module.exports = router;
