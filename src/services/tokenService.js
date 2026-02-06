const axios = require("axios");
const redis = require("../config/redis");
const oauthConfig = require("../config/oauth");

const TOKEN_KEY = "oauth:access_token";
const LOCK_KEY = "oauth:lock";

async function fetchNewToken() {
  const response = await axios.post(oauthConfig.tokenUrl, {
    client_id: oauthConfig.clientId,
    client_secret: oauthConfig.clientSecret,
    grant_type: oauthConfig.grantType,
  });

  const token = response.data.access_token;
  const expiresIn = response.data.expires_in;

  // cache token with safe expiry
  await redis.set(TOKEN_KEY, token, {
    EX: expiresIn - 60,
  });

  return token;
}

async function getAccessToken() {
  // 1️⃣ check cache
  const cachedToken = await redis.get(TOKEN_KEY);
  if (cachedToken) {
    return cachedToken;
  }

  // 2️⃣ acquire lock (prevents multiple refreshes)
  const lock = await redis.set(LOCK_KEY, "locked", {
    NX: true,
    EX: 5,
  });

  if (lock) {
    try {
      return await fetchNewToken();
    } finally {
      await redis.del(LOCK_KEY);
    }
  }

  // 3️⃣ wait & retry if another request is refreshing
  await new Promise((res) => setTimeout(res, 200));
  return getAccessToken();
}

module.exports = { getAccessToken };
