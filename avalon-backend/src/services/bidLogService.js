const { supabase } = require('../config/supabase');

// ---------------------------------------------------------------------------
// Bid Log Service – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Logs bid events to Supabase "bid_logs" table for real-time subscriptions.
// This is a secondary log — the primary bid record lives in MySQL.
// ---------------------------------------------------------------------------

/**
 * Log a bid to the Supabase bid_logs table.
 * Non-blocking — failures are logged but don't break the bid flow.
 *
 * @param {number} auctionId
 * @param {number} userId
 * @param {number} amount
 * @returns {Promise<object|null>}
 */
const logBid = async (auctionId, userId, amount) => {
  if (!supabase) {
    console.warn('⚠️  Supabase not configured — bid log skipped.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('bid_logs')
      .insert([
        {
          auction_id: auctionId,
          user_id: userId,
          amount: parseFloat(amount),
          timestamp: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Supabase bid_logs insert error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Bid log service error:', err.message);
    return null;
  }
};

module.exports = { logBid };
