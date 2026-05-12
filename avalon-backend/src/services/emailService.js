const nodemailer = require('nodemailer');

// ---------------------------------------------------------------------------
// Email Service – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Reusable email service using Nodemailer with SMTP transport.
// Supports Gmail, Ethereal (dev/test), or any SMTP provider.
// ---------------------------------------------------------------------------

/**
 * Create the SMTP transporter.
 * Falls back gracefully if env vars are not set.
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn(
      '⚠️  SMTP credentials not configured.\n' +
      '   Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to enable email.'
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port, 10) || 587,
    secure: parseInt(port, 10) === 465, // true for 465, false otherwise
    auth: { user, pass },
  });
};

let transporter = null;

/**
 * Send an email. Silently logs a warning if SMTP is not configured.
 * @param {string} to – recipient email address
 * @param {string} subject – email subject
 * @param {string} html – email body (HTML)
 * @returns {Promise<object|null>}
 */
const sendEmail = async (to, subject, html) => {
  if (!transporter) {
    transporter = createTransporter();
  }

  if (!transporter) {
    console.warn(`📧  Email skipped (SMTP not configured): "${subject}" → ${to}`);
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Avalon Auctions" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`📧  Email sent: "${subject}" → ${to} (${info.messageId})`);
    if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
      console.log(`🔗  Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  } catch (error) {
    console.error(`📧  Email failed: "${subject}" → ${to}`, error.message);
    return null; // Non-blocking — don't crash the request
  }
};

// ========================  TEMPLATE FUNCTIONS  ========================

/**
 * Email to seller when their auction is created.
 */
const sendAuctionCreatedEmail = async (sellerEmail, sellerName, auctionTitle) => {
  const subject = `🏛️ Your auction "${auctionTitle}" is live!`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #e94f37 0%, #c0392b 100%); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 24px;">🏛️ Avalon Auction Manager</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #e94f37; margin-top: 0;">Auction Created Successfully!</h2>
        <p>Hi <strong>${sellerName}</strong>,</p>
        <p>Your auction <strong>"${auctionTitle}"</strong> is now live and accepting bids.</p>
        <p>You'll receive notifications when bids are placed.</p>
        <div style="margin-top: 24px; padding: 16px; background: #1a1a1a; border-radius: 8px; border-left: 4px solid #e94f37;">
          <p style="margin: 0; font-size: 14px; color: #999;">Keep an eye on your dashboard for real-time updates.</p>
        </div>
      </div>
      <div style="padding: 16px 32px; background: #111; text-align: center; font-size: 12px; color: #666;">
        © 2026 Avalon Auction Manager
      </div>
    </div>
  `;
  return sendEmail(sellerEmail, subject, html);
};

/**
 * Email to previous high bidder when they're outbid.
 */
const sendOutbidEmail = async (bidderEmail, bidderName, auctionTitle, newBidAmount, previousBidAmount) => {
  const subject = `⚠️ You've been outbid on "${auctionTitle}"`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #e94f37 0%, #c0392b 100%); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 24px;">🏛️ Avalon Auction Manager</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #e94f37; margin-top: 0;">You've Been Outbid!</h2>
        <p>Hi <strong>${bidderName}</strong>,</p>
        <p>Someone placed a higher bid on <strong>"${auctionTitle}"</strong>.</p>
        <div style="margin: 24px 0; padding: 16px; background: #1a1a1a; border-radius: 8px;">
          <p style="margin: 4px 0;"><span style="color: #999;">Your bid:</span> <strong style="text-decoration: line-through;">$${previousBidAmount}</strong></p>
          <p style="margin: 4px 0;"><span style="color: #999;">New high bid:</span> <strong style="color: #e94f37;">$${newBidAmount}</strong></p>
        </div>
        <p>Don't miss out — place a new bid before the auction ends!</p>
      </div>
      <div style="padding: 16px 32px; background: #111; text-align: center; font-size: 12px; color: #666;">
        © 2026 Avalon Auction Manager
      </div>
    </div>
  `;
  return sendEmail(bidderEmail, subject, html);
};

/**
 * Email to the winner when an auction closes.
 */
const sendAuctionWonEmail = async (winnerEmail, winnerName, auctionTitle, winningAmount) => {
  const subject = `🏆 Congratulations! You won "${auctionTitle}"`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 24px;">🏛️ Avalon Auction Manager</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #27ae60; margin-top: 0;">🏆 You Won the Auction!</h2>
        <p>Hi <strong>${winnerName}</strong>,</p>
        <p>Congratulations! You are the winner of <strong>"${auctionTitle}"</strong>.</p>
        <div style="margin: 24px 0; padding: 16px; background: #1a1a1a; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #999; font-size: 14px;">Winning Bid</p>
          <p style="margin: 4px 0; font-size: 32px; color: #27ae60; font-weight: bold;">$${winningAmount}</p>
        </div>
        <p>We'll be in touch with payment and shipping details.</p>
      </div>
      <div style="padding: 16px 32px; background: #111; text-align: center; font-size: 12px; color: #666;">
        © 2026 Avalon Auction Manager
      </div>
    </div>
  `;
  return sendEmail(winnerEmail, subject, html);
};

module.exports = {
  sendEmail,
  sendAuctionCreatedEmail,
  sendOutbidEmail,
  sendAuctionWonEmail,
};
