const express = require("express");
const router = express.Router();

router.get("/inventory", (req, res) => {
  const randomFail = Math.random() < 0.3;
  const randomDelay = Math.random() * 2000;

  setTimeout(() => {
    if (randomFail) {
      return res.status(500).json({ error: "External service failure" });
    }

    res.json({
      productId: 1,
      stock: 42
    });
  }, randomDelay);
});

module.exports = router;
