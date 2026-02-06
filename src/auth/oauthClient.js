const axios = require("axios");
const redis = require("../config/redis");

const TOKEN_KEY = "oauth:access_token";
const LOCK_KEY = "oauth:lock";

async function getAccessToken() {
  // 1️⃣ Check Redis cache
  const cachedToken = await redis.get(TOKEN_KEY);
  if (cachedToken) {
    return cachedToken;
  }

  // 2️⃣ Redis lock (concurrency safety)
  const lock = await redis.set(LOCK_KEY, "1", "NX", "EX", 10);
  if (!lock) {
    await new Promise((r) => setTimeout(r, 200));
    return getAccessToken();
  }

  try {
    // 3️⃣ Call MOCK OAuth endpoint
    const response = await axios.post(
      process.env.OAUTH_TOKEN_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        scope: process.env.OAUTH_SCOPE
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        timeout: 5000
      }
    );

    const { access_token, expires_in } = response.data;

    // 4️⃣ Cache token in Redis
    await redis.set(
      TOKEN_KEY,
      access_token,
      "EX",
      expires_in - 60
    );

    return access_token;
  } finally {
    // 5️⃣ Release lock
    await redis.del(LOCK_KEY);
  }
}

module.exports = { getAccessToken };
