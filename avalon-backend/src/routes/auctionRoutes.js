const express = require('express');
const router = express.Router();

const {
  createAuction,
  getAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
} = require('../controllers/auctionController');
const { closeAuction } = require('../controllers/bidController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { auctionRules, validate } = require('../middleware/validators');

// ---------------------------------------------------------------------------
// Auction Routes – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// POST   /auctions         – create a new auction (seller only, with image)
// GET    /auctions         – list all auctions (public)
// GET    /auctions/:id     – get auction by ID (public)
// PUT    /auctions/:id     – update auction (seller only)
// DELETE /auctions/:id     – delete auction (seller only)
// POST   /auctions/:id/close – close auction (seller only)
// ---------------------------------------------------------------------------

router.post(
  '/',
  authenticate,
  authorize('seller'),
  upload.single('image'),
  auctionRules,
  validate,
  createAuction,
);

router.get('/', getAuctions);
router.get('/:id', getAuctionById);

router.put(
  '/:id',
  authenticate,
  authorize('seller'),
  upload.single('image'),
  updateAuction,
);

router.delete(
  '/:id',
  authenticate,
  authorize('seller'),
  deleteAuction,
);

router.post(
  '/:id/close',
  authenticate,
  authorize('seller'),
  closeAuction,
);

module.exports = router;
