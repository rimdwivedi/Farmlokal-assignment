const express = require("express");
const crypto = require("crypto");

const router = express.Router();

/**
 * MOCK OAuth2 TOKEN ENDPOINT
 * Client Credentials Flow
 */
router.post("/token", (req, res) => {
  const { grant_type, client_id, client_secret } = req.body;

  if (grant_type !== "client_credentials") {
    return res.status(400).json({ error: "invalid_grant" });
  }

  if (
    client_id !== "mock_client_id" ||
    client_secret !== "mock_client_secret"
  ) {
    return res.status(401).json({ error: "invalid_client" });
  }

  // DYNAMICALLY GENERATED DUMMY TOKEN
  const accessToken = crypto.randomBytes(32).toString("hex");

  res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 300 // 5 minutes
  });
});

module.exports = router;
