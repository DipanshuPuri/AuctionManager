const Bid = require('../models/Bid');
const Auction = require('../models/Auction');
const User = require('../models/User');
const { sendOutbidEmail, sendAuctionWonEmail } = require('../services/emailService');
const { logBid } = require('../services/bidLogService');

// ---------------------------------------------------------------------------
// Bid Controller – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Handles bid placement with validation, outbid notifications, and
// Supabase realtime logging.
// ---------------------------------------------------------------------------

// ========================  PLACE BID  ========================

const placeBid = async (req, res, next) => {
  try {
    const { auction_id, amount } = req.body;
    const bidderId = req.user.id;
    const bidAmount = parseFloat(amount);

    // --- Find the auction ---
    const auction = await Auction.findByPk(auction_id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found.',
      });
    }

    // --- Check auction is active ---
    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Cannot bid on an auction with status "${auction.status}".`,
      });
    }

    // --- Check auction end time ---
    if (auction.end_time && new Date(auction.end_time) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This auction has ended.',
      });
    }

    // --- Seller cannot bid on own auction ---
    if (auction.seller_id === bidderId) {
      return res.status(403).json({
        success: false,
        message: 'You cannot bid on your own auction.',
      });
    }

    // --- Bid must be higher than current price ---
    const currentPrice = parseFloat(auction.current_price);
    if (bidAmount <= currentPrice) {
      return res.status(400).json({
        success: false,
        message: `Bid must be higher than the current price of $${currentPrice.toFixed(2)}.`,
      });
    }

    // --- Find previous high bidder for outbid notification ---
    const previousHighBid = await Bid.findOne({
      where: { auction_id },
      order: [['amount', 'DESC']],
      include: [{ model: User, as: 'bidder', attributes: ['id', 'email', 'name'] }],
    });

    // --- Create the bid ---
    const bid = await Bid.create({
      amount: bidAmount,
      auction_id,
      bidder_id: bidderId,
    });

    // --- Update auction current price ---
    await auction.update({ current_price: bidAmount });

    // --- Log to Supabase for realtime (non-blocking) ---
    logBid(auction_id, bidderId, bidAmount).catch(() => {});

    // --- Send outbid email to previous high bidder (non-blocking) ---
    if (previousHighBid && previousHighBid.bidder && previousHighBid.bidder.id !== bidderId) {
      sendOutbidEmail(
        previousHighBid.bidder.email,
        previousHighBid.bidder.name,
        auction.title,
        bidAmount.toFixed(2),
        parseFloat(previousHighBid.amount).toFixed(2),
      ).catch(() => {});
    }

    return res.status(201).json({
      success: true,
      message: 'Bid placed successfully.',
      data: {
        bid: {
          id: bid.id,
          amount: bid.amount,
          auction_id: bid.auction_id,
          bidder_id: bid.bidder_id,
          created_at: bid.created_at,
        },
        auction: {
          id: auction.id,
          current_price: bidAmount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ========================  GET BIDS FOR AUCTION  ========================

const getBidsByAuction = async (req, res, next) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findByPk(auctionId);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found.',
      });
    }

    const bids = await Bid.findAll({
      where: { auction_id: auctionId },
      include: [
        {
          model: User,
          as: 'bidder',
          attributes: ['id', 'name', 'username'],
        },
      ],
      order: [['amount', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: bids,
    });
  } catch (error) {
    next(error);
  }
};

// ========================  CLOSE AUCTION  ========================

const closeAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findByPk(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found.',
      });
    }

    // Only the seller can close their auction
    if (auction.seller_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the auction seller can close this auction.',
      });
    }

    if (auction.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Auction is already closed.',
      });
    }

    await auction.update({ status: 'closed' });

    // Find the winning bid
    const winningBid = await Bid.findOne({
      where: { auction_id: auction.id },
      order: [['amount', 'DESC']],
      include: [{ model: User, as: 'bidder', attributes: ['id', 'name', 'email'] }],
    });

    // Send winner email (non-blocking)
    if (winningBid && winningBid.bidder) {
      sendAuctionWonEmail(
        winningBid.bidder.email,
        winningBid.bidder.name,
        auction.title,
        parseFloat(winningBid.amount).toFixed(2),
      ).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      message: 'Auction closed successfully.',
      data: {
        auction_id: auction.id,
        winner: winningBid ? {
          bidder_id: winningBid.bidder.id,
          name: winningBid.bidder.name,
          winning_amount: winningBid.amount,
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeBid, getBidsByAuction, closeAuction };
