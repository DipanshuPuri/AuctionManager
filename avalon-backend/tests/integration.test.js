require('./setup');
const request = require('supertest');
const { app } = require('../server');
const { sequelize } = require('../src/models');

// ---------------------------------------------------------------------------
// Integration Tests – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Full lifecycle: create seller → create auction → create buyer → place bid
// → verify price update → close auction
// ---------------------------------------------------------------------------

describe('Auction Lifecycle Integration', () => {
  let sellerToken, buyerToken, buyer2Token, auctionId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('Step 1: Create a seller account', async () => {
    const res = await request(app).post('/auth/signup').send({
      name: 'Integration Seller', username: 'intseller', email: 'intseller@test.com', password: 'password123', role: 'seller',
    }).expect(201);
    expect(res.body.success).toBe(true);

    const login = await request(app).post('/auth/login').send({ email: 'intseller@test.com', password: 'password123' });
    sellerToken = login.body.data.token;
    expect(sellerToken).toBeDefined();
  });

  it('Step 2: Create an auction', async () => {
    const res = await request(app)
      .post('/auctions')
      .set('Authorization', `Bearer ${sellerToken}`)
      .field('title', 'Vintage Watch')
      .field('description', 'A rare vintage timepiece')
      .field('starting_price', '500.00')
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Vintage Watch');
    expect(res.body.data.current_price).toBe('500.00');
    auctionId = res.body.data.id;
  });

  it('Step 3: Create first buyer and place bid', async () => {
    await request(app).post('/auth/signup').send({
      name: 'Buyer One', username: 'buyer1int', email: 'buyer1int@test.com', password: 'password123', role: 'buyer',
    });
    const login = await request(app).post('/auth/login').send({ email: 'buyer1int@test.com', password: 'password123' });
    buyerToken = login.body.data.token;

    const res = await request(app)
      .post('/bids')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ auction_id: auctionId, amount: 750 })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.auction.current_price).toBe(750);
  });

  it('Step 4: Create second buyer and outbid', async () => {
    await request(app).post('/auth/signup').send({
      name: 'Buyer Two', username: 'buyer2int', email: 'buyer2int@test.com', password: 'password123', role: 'buyer',
    });
    const login = await request(app).post('/auth/login').send({ email: 'buyer2int@test.com', password: 'password123' });
    buyer2Token = login.body.data.token;

    const res = await request(app)
      .post('/bids')
      .set('Authorization', `Bearer ${buyer2Token}`)
      .send({ auction_id: auctionId, amount: 1000 })
      .expect(201);

    expect(res.body.data.auction.current_price).toBe(1000);
  });

  it('Step 5: Verify auction price updated', async () => {
    const res = await request(app)
      .get(`/auctions/${auctionId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(parseFloat(res.body.data.current_price)).toBe(1000);
    expect(res.body.data.bids.length).toBeGreaterThanOrEqual(2);
  });

  it('Step 6: Close the auction', async () => {
    const res = await request(app)
      .post(`/auctions/${auctionId}/close`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.winner).toBeTruthy();
    expect(parseFloat(res.body.data.winner.winning_amount)).toBe(1000);
  });

  it('Step 7: Cannot bid on closed auction', async () => {
    const res = await request(app)
      .post('/bids')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ auction_id: auctionId, amount: 1500 })
      .expect(400);

    expect(res.body.message).toContain('closed');
  });
});
