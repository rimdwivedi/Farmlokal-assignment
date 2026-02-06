const { getAccessToken } = require("../services/tokenService");

async function authMiddleware(req, res, next) {
  try {
    const token = await getAccessToken();
    req.accessToken = token;
    next();
  } catch (err) {
    console.error("OAuth error:", err.message);
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = authMiddleware;
