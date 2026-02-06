const express = require("express");
const router = express.Router();
const { getAccessToken } = require("../auth/oauthClient");

router.get("/token", async (req, res, next) => {
  try {
    const token = await getAccessToken();
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
