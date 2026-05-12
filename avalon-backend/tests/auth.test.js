require('./setup');
const request = require('supertest');
const { app } = require('../server');
const { sequelize } = require('../src/models');

// ---------------------------------------------------------------------------
// Auth Tests – Avalon (AuctionManager)
// ---------------------------------------------------------------------------

describe('Auth API', () => {
  // Force-sync DB before all tests (test env drops & recreates)
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const testUser = {
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: 'buyer',
  };

  // ---- SIGNUP TESTS ----

  describe('POST /auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send(testUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data.role).toBe('buyer');
      // Password hash should NOT be returned
      expect(res.body.data).not.toHaveProperty('password_hash');
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send(testUser)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({ email: 'incomplete@test.com' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({ ...testUser, email: 'not-an-email', username: 'unique1' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({ ...testUser, email: 'short@test.com', username: 'unique2', password: '12' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  // ---- LOGIN TESTS ----

  describe('POST /auth/login', () => {
    it('should login with valid credentials and return token', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'notfound@test.com', password: 'password123' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  // ---- GET CURRENT USER TESTS ----

  describe('GET /auth/me', () => {
    let token;

    beforeAll(async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      token = res.body.data.token;
    });

    it('should return user profile with valid token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data).not.toHaveProperty('password_hash');
    });

    it('should reject request without token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});
