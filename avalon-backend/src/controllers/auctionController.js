const Auction = require('../models/Auction');
const User = require('../models/User');
const Bid = require('../models/Bid');
const { uploadImage, deleteImage } = require('../services/storageService');
const { sendAuctionCreatedEmail } = require('../services/emailService');

// ---------------------------------------------------------------------------
// Auction Controller – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Handles CRUD operations for auctions including image upload via Supabase.
// ---------------------------------------------------------------------------

// ========================  CREATE AUCTION  ========================

const createAuction = async (req, res, next) => {
  try {
    const { title, description, starting_price, start_time, end_time } = req.body;
    const sellerId = req.user.id;

    // Handle image upload if provided
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer, req.file.originalname);
    }

    const auction = await Auction.create({
      title,
      description,
      starting_price: parseFloat(starting_price),
      current_price: parseFloat(starting_price),
      image_url: imageUrl,
      status: 'active',
      start_time: start_time || new Date(),
      end_time: end_time || null,
      seller_id: sellerId,
    });

    // Send email notification to seller (non-blocking)
    const seller = await User.findByPk(sellerId);
    if (seller) {
      sendAuctionCreatedEmail(seller.email, seller.name, title).catch(() => {});
    }

    return res.status(201).json({
      success: true,
      message: 'Auction created successfully.',
      data: auction,
    });
  } catch (error) {
    next(error);
  }
};

// ========================  GET ALL AUCTIONS  ========================

const getAuctions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status; // optional filter

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows: auctions } = await Auction.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'username'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      data: {
        auctions,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ========================  GET AUCTION BY ID  ========================

const getAuctionById = async (req, res, next) => {
  try {
    const auction = await Auction.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'username'],
        },
        {
          model: Bid,
          as: 'bids',
          include: [
            {
              model: User,
              as: 'bidder',
              attributes: ['id', 'name', 'username'],
            },
          ],
          order: [['amount', 'DESC']],
          limit: 50,
        },
      ],
    });

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: auction,
    });
  } catch (error) {
    next(error);
  }
};

// ========================  UPDATE AUCTION  ========================

const updateAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findByPk(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found.',
      });
    }

    // Only the seller who created the auction can update it
    if (auction.seller_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own auctions.',
      });
    }

    const { title, description, starting_price, start_time, end_time, status } = req.body;

    // Handle new image upload
    let imageUrl = auction.image_url;
    if (req.file) {
      // Delete old image if exists
      if (auction.image_url) {
        await deleteImage(auction.image_url);
      }
      imageUrl = await uploadImage(req.file.buffer, req.file.originalname);
    }

    await auction.update({
      title: title || auction.title,
      description: description !== undefined ? description : auction.description,
      starting_price: starting_price ? parseFloat(starting_price) : auction.starting_price,
      image_url: imageUrl,
      start_time: start_time || auction.start_time,
      end_time: end_time || auction.end_time,
      status: status || auction.status,
    });

    return res.status(200).json({
      success: true,
      message: 'Auction updated successfully.',
      data: auction,
    });
  } catch (error) {
    next(error);
  }
};

// ========================  DELETE AUCTION  ========================

const deleteAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findByPk(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found.',
      });
    }

    // Only the seller who created the auction can delete it
    if (auction.seller_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own auctions.',
      });
    }

    // Delete image from storage
    if (auction.image_url) {
      await deleteImage(auction.image_url);
    }

    await auction.destroy();

    return res.status(200).json({
      success: true,
      message: 'Auction deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAuction,
  getAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
};
