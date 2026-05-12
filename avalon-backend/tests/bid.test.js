require('./setup');
const request = require('supertest');
const { app } = require('../server');
const { sequelize } = require('../src/models');

// ---------------------------------------------------------------------------
// Bid Tests – Avalon (AuctionManager)
// ---------------------------------------------------------------------------

describe('Bid API', () => {
  let buyerToken, sellerToken, auctionId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create a seller
    await request(app).post('/auth/signup').send({
      name: 'Seller', username: 'seller1', email: 'seller@test.com', password: 'password123', role: 'seller',
    });
    const sellerLogin = await request(app).post('/auth/login').send({ email: 'seller@test.com', password: 'password123' });
    sellerToken = sellerLogin.body.data.token;

    // Create a buyer
    await request(app).post('/auth/signup').send({
      name: 'Buyer', username: 'buyer1', email: 'buyer@test.com', password: 'password123', role: 'buyer',
    });
    const buyerLogin = await request(app).post('/auth/login').send({ email: 'buyer@test.com', password: 'password123' });
    buyerToken = buyerLogin.body.data.token;

    // Create an auction
    const auctionRes = await request(app)
      .post('/auctions')
      .set('Authorization', `Bearer ${sellerToken}`)
      .field('title', 'Test Auction Item')
      .field('description', 'A test item')
      .field('starting_price', '100.00');
    auctionId = auctionRes.body.data.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /bids', () => {
    it('should place a valid bid', async () => {
      const res = await request(app)
        .post('/bids')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ auction_id: auctionId, amount: 150 })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.bid.amount).toBe('150.00');
    });

    it('should reject bid lower than current price', async () => {
      const res = await request(app)
        .post('/bids')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ auction_id: auctionId, amount: 50 })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('higher than');
    });

    it('should reject bid without authentication', async () => {
      const res = await request(app)
        .post('/bids')
        .send({ auction_id: auctionId, amount: 200 })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should reject bid with invalid amount', async () => {
      const res = await request(app)
        .post('/bids')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ auction_id: auctionId, amount: -10 })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should reject bid on non-existent auction', async () => {
      const res = await request(app)
        .post('/bids')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ auction_id: 99999, amount: 200 })
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });
});
