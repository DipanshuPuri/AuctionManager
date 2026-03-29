# 🏛️ AuctionManager — Avalon

A real-time online auction platform backend built with Node.js, Express, and MySQL. Avalon enables users to register as buyers or sellers, list auctions, place competitive bids, and experience live auction updates via WebSockets.

> **Course:** Sem 6 — Fundamentals of Software Engineering  
> **Repository:** [github.com/DipanshuPuri/AuctionManager](https://github.com/DipanshuPuri/AuctionManager)

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [GraphQL API](#-graphql-api)
- [WebSocket Events](#-websocket-events)
- [Team Structure](#-team-structure)
- [Future Scope](#-future-scope)
- [License](#-license)

---

## 🛠️ Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Runtime          | Node.js                             |
| Framework        | Express.js                          |
| Database         | MySQL                               |
| ORM              | Sequelize                           |
| Authentication   | JWT (jsonwebtoken) + bcrypt          |
| API (REST)       | Express Router                      |
| API (GraphQL)    | express-graphql + graphql            |
| Real-time        | Socket.IO                           |
| Validation       | express-validator                   |
| Environment      | dotenv                              |

---

## 📁 Project Structure

```
avalon-backend/
├── server.js                        # Entry point – Express + Socket.IO bootstrap
├── package.json
├── .env                             # Environment variables (git-ignored)
├── .env.example                     # Template for team members
│
└── src/
    ├── config/
    │   └── db.js                    # Sequelize connection & pool config
    │
    ├── models/
    │   ├── index.js                 # Model registry, associations & sync strategy
    │   └── User.js                  # User model (buyer / seller)
    │
    ├── controllers/
    │   └── authController.js        # Signup, login, getCurrentUser
    │
    ├── middleware/
    │   ├── authMiddleware.js         # JWT verification & role-based authorization
    │   └── validators.js            # express-validator rule chains
    │
    ├── routes/
    │   └── authRoutes.js            # POST /auth/signup, /login, GET /auth/me
    │
    ├── graphql/
    │   └── schema.js                # GraphQL types, queries & resolvers
    │
    └── socket/
        └── socketHandler.js         # Socket.IO event registration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://dev.mysql.com/downloads/) v8+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/DipanshuPuri/AuctionManager.git
cd AuctionManager/avalon-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your local MySQL credentials (see [Environment Variables](#-environment-variables)).

### 4. Create the database

```sql
CREATE DATABASE avalon_db;
```

### 5. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

You should see:

```
✅  Database connection established successfully.
⚙️   Sync strategy: development
📦  Models synchronised (alter mode).
📋  Tables in database: users
🚀  Avalon server running on http://localhost:5000
🔌  Socket.IO ready and listening
```

---

## 🔐 Environment Variables

| Variable       | Description                 | Example                        |
| -------------- | --------------------------- | ------------------------------ |
| `DB_NAME`      | MySQL database name          | `avalon_db`                    |
| `DB_USER`      | MySQL username               | `root`                         |
| `DB_PASSWORD`  | MySQL password               | `your_password`                |
| `DB_HOST`      | MySQL host                   | `localhost`                    |
| `PORT`         | Server port                  | `5000`                         |
| `NODE_ENV`     | Environment mode             | `development` / `production`   |
| `JWT_SECRET`   | Secret key for signing JWTs  | `your_secret_key`              |
| `JWT_EXPIRY`   | Token expiration duration    | `7d`                           |

---

## 📡 API Reference

### Base URL: `http://localhost:5000`

### Authentication

#### Register a new user

```http
POST /auth/signup
Content-Type: application/json
```

| Field      | Type     | Required | Description                    |
| ---------- | -------- | -------- | ------------------------------ |
| `name`     | `string` | ✅       | 2–100 characters               |
| `email`    | `string` | ✅       | Valid email, unique             |
| `password` | `string` | ✅       | Minimum 6 characters           |
| `role`     | `string` | ❌       | `buyer` (default) or `seller`  |

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

---

#### Login

```http
POST /auth/login
Content-Type: application/json
```

| Field      | Type     | Required |
| ---------- | -------- | -------- |
| `email`    | `string` | ✅       |
| `password` | `string` | ✅       |

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer"
    }
  }
}
```

---

#### Get current user (Protected)

```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer",
    "created_at": "2026-03-29T06:30:00.000Z",
    "updated_at": "2026-03-29T06:30:00.000Z"
  }
}
```

---

## 🔮 GraphQL API

**Endpoint:** `http://localhost:5000/graphql`

Open this URL in a browser to use the **GraphiQL** interactive explorer.

### Example queries

#### Fetch all users

```graphql
{
  users {
    id
    name
    email
    role
  }
}
```

#### Fetch a single user by ID

```graphql
{
  user(id: 1) {
    name
    email
    role
    created_at
  }
}
```

---

## 🔌 WebSocket Events

**Connection URL:** `http://localhost:5000`

| Event          | Direction        | Payload                       | Description              |
| -------------- | ---------------- | ----------------------------- | ------------------------ |
| `connection`   | Client → Server  | —                             | Logs new connection      |
| `testEvent`    | Client → Server  | `{ message: "..." }`         | Test event for demo      |
| `testResponse` | Server → Client  | `{ success, message, received, timestamp }` | Confirmation response |
| `disconnect`   | Client → Server  | —                             | Logs disconnection       |

### Quick test (browser console)

```js
const socket = io('http://localhost:5000');
socket.emit('testEvent', { message: 'Hello Avalon!' });
socket.on('testResponse', (data) => console.log(data));
```

---

## 👥 Team Structure

| Member     | Module              | Scope                                        |
| ---------- | ------------------- | -------------------------------------------- |
| Person A   | 🔐 Authentication   | User model, signup/login, JWT, middleware     |
| Person B   | 🏷️ Auctions         | Auction model, CRUD, seller authorization     |
| Person C   | 💰 Bidding          | Bid model, placement logic, real-time updates |

### Git Workflow

Single-branch (`main`), sequential workflow:

```
Pull → Code → Test → Commit → Pull → Push → Notify next person
```

---

## 🔮 Future Scope

- **Real-time auctions** — live bid updates via Socket.IO rooms
- **Auction timers** — countdown with auto-close and winner selection
- **Image uploads** — auction item photos with Multer / Cloudinary
- **Payment integration** — Stripe / Razorpay for winning bids
- **Admin dashboard** — user moderation and auction oversight
- **Notifications** — email / in-app alerts for outbid events
- **Rate limiting** — prevent bid spam and API abuse

---

## 📄 License

This project is part of an academic coursework submission and is available under the [ISC License](https://opensource.org/licenses/ISC).

---

<p align="center">
  Built with ❤️ by the Avalon Team
</p>
