# FarmLokal Backend Engineering Assignment

## Overview

This project is a backend service built as part of the **FarmLokal Backend Engineering Assignment**.

It simulates real-world backend challenges such as authentication, caching, webhook handling, performance optimization, and reliability using **Node.js, MySQL, and Redis**.

The system is designed with **scalability, low latency, and fault tolerance** in mind—similar to production systems handling large datasets and unreliable external integrations.

---

## 🛠 Tech Stack

- **Node.js (JavaScript)** – Backend runtime  
- **Express.js** – API framework  
- **MySQL** – Primary data store (products)  
- **Redis** – Caching, token storage, idempotency, rate limiting  
- **Postman** – API testing  

---

## 📂 Project Structure
```
src/
│
├── app.js                      # Express app setup
├── server.js                   # Server bootstrap
│
├── auth/
│   └── oauthClient.js          # OAuth client credentials logic (mocked)
│
├── routes/
│   ├── products.js             # Product listing API
│   ├── webhook.js              # Webhook handler with idempotency
│   └── testAuth.js             # OAuth test route
│
├── services/
│   └── externalApiClient.js    # External API integration (retries & timeout)
│
├── middlewares/
│   └── rateLimit.js            # Rate limiting middleware
│
├── utils/
│   └── redis.js                # Redis connection singleton
│
└── config/
    └── db.js                   # MySQL connection
```

---

## 🔐 Authentication (OAuth2 – Client Credentials)

### Implementation

- OAuth2 **Client Credentials flow** is implemented.
- A **mock OAuth provider** is used to avoid dependency on external services.

### Token Strategy

- Access token is generated once
- Cached in Redis
- Reused until expiry

**Redis Key:**
```
oauth:access_token
```

### Concurrency Safety

- Redis-based lock ensures:
  - Only one request refreshes the token
  - Prevents token stampede under high concurrency

**Interview-ready explanation:**

> "OAuth tokens are cached in Redis to avoid repeated token requests.  
> A Redis lock ensures concurrency safety so only one request refreshes the token."

---

## 🔗 External API Integrations

### 1️⃣ Synchronous External API

Handled via a service layer with:

- Request timeout
- Automatic retries
- Simple circuit breaker (fail fast on repeated failures)

This protects the system from slow or unreliable third-party APIs.

---

### 2️⃣ Webhook / Callback-based API

#### Key Features

- **Idempotency implemented using Redis**
- Each webhook request must include a unique header:
```
  x-event-id
```

#### Behavior

| Scenario         | Result         |
|------------------|----------------|
| First event      | Processed      |
| Duplicate event  | Ignored safely |

- Event IDs stored in Redis with **24-hour TTL**

**Interview-ready explanation:**

> "Webhook idempotency is handled using Redis by storing unique event IDs.  
> Duplicate retries are detected and ignored to ensure safe processing."

---

## 🛒 Product Listing API

### Endpoint
```
GET /products
```

### Features

- Cursor-based pagination
- Search
- Sorting
- Filtering
- Optimized for **1M+ records**

### Performance Optimizations

- Indexed MySQL columns:
  - `id`
  - `category`
  - `name`
- Cursor pagination avoids expensive OFFSET scans
- Redis caching for frequently accessed queries

### Example Request
```
GET /products?cursor=100&limit=20&category=fruits&search=apple
```

---

## ⚡ Performance & Reliability Techniques

Implemented reliability patterns:

✅ **Redis Caching**
- OAuth tokens
- Product listing results
- Webhook event IDs

✅ **Rate Limiting**
- Prevents API abuse
- Applied globally via middleware

✅ **Circuit Breaker**
- Stops repeated calls to failing external services
- Improves system stability

---

## 🧪 Testing

### OAuth Token Test

**Endpoint:**
```
GET /auth/token
```

**Expected Response:**
```json
{
  "token": "mocked-access-token"
}
```

**Second Request Behavior:**
- Token is served from Redis
- No token regeneration occurs

### Webhook Test (Postman)

**Endpoint:**
```
POST /webhook
```

**Headers:**
```
x-event-id: evt_101
```

**First Request Response:**
```json
{
  "status": "processed"
}
```

**Duplicate Request Response:**
```json
{
  "status": "duplicate_ignored"
}
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone <github-repo-url>
cd farmlokal-backend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file:
```env
PORT=3000
REDIS_URL=redis://localhost:6379

OAUTH_TOKEN_URL=https://example.com/oauth/token
OAUTH_CLIENT_ID=mock_client
OAUTH_CLIENT_SECRET=mock_secret
OAUTH_SCOPE=read
```

### 4️⃣ Start Redis
```bash
redis-server
```

### 5️⃣ Run Server
```bash
node src/server.js
```

---

## 🚀 Deployment

- Deployable on Render
- Compatible with Docker / Kubernetes

  Deployed URL:
  https://farmlokal-assignment.onrender.com/

  ## 📌 API Endpoints

### 🔐 Authentication
- **GET** https://farmlokal-assignment.onrender.com/auth/token
  Returns a mocked OAuth2 access token (cached in Redis).

### 🛒 Products
- **GET**  https://farmlokal-assignment.onrender.com/products
  Product listing with cursor-based pagination, search, sorting, and filtering.

### 🔗 Webhook
- **POST** https://farmlokal-assignment.onrender.com/webhook
  Webhook receiver with Redis-based idempotency.  
  **Header required:** `x-event-id`

### 🧪 External API Test
- **GET** https://farmlokal-assignment.onrender.com/test
  Tests external API integration with retry, timeout, and circuit breaker logic.

### ❤️ Health Check
- **GET** https://farmlokal-assignment.onrender.com/health  
  Returns service health status.


**Health Check:**
```
GET /health
```

---

## ⚖️ Design Trade-offs

- Mock OAuth used to focus on system design rather than external setup
- Redis chosen over in-memory caching for:
  - Distributed safety
  - Horizontal scalability
- Cursor-based pagination preferred over OFFSET for large datasets
- Circuit breaker logic kept intentionally simple for readability

---

## 🎯 Conclusion

This project demonstrates:

- Real-world backend architecture
- Redis-first design for performance and reliability
- Clean separation of concerns
- Production-grade patterns used at scale

It closely mirrors challenges faced in hyperlocal marketplaces like FarmLokal, where reliability, speed, and scalability are critical.

---

## 🙌 Author

**Rimjhim Dwivedi**  
Backend Engineering Assignment – FarmLokal
