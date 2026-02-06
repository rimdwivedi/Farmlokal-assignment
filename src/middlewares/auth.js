const { getAccessToken } = require("../services/tokenService");

async function authMiddleware(req, res, next) {
  try {
    const token = await getAccessToken();
    req.accessToken = token;
    next();
  } catch (err) {
    res.status(401).json({ error: "Authentication failed" });
  }
}

module.exports = authMiddleware;
