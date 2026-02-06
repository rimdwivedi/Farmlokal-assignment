const express = require("express");
const router = express.Router();
const { fetchInventory } = require("../services/externalApiClient");

router.get("/inventory", async (req, res, next) => {
  try {
    const data = await fetchInventory();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
