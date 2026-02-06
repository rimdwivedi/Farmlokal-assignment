const express = require("express");
const router = express.Router();
const redis = require("../config/redis");

router.post("/", async (req, res, next) => {
  try {
    const eventId = req.headers["x-event-id"];

    if (!eventId) {
      return res.status(400).json({ error: "x-event-id header missing" });
    }

    // Check if event already processed
    const alreadyProcessed = await redis.get(`webhook:${eventId}`);

    if (alreadyProcessed) {
      return res.json({ status: "duplicate_ignored" });
    }

    // Mark event as processed (store for 24 hours)
    await redis.set(`webhook:${eventId}`, "1", "EX", 86400);

    // Simulate processing
    console.log("Processing webhook:", req.body);

    res.json({ status: "processed" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
