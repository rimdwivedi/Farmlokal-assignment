const express = require("express");
const redis = require("../config/redis");
const { getProducts } = require("../services/productService");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const filters = {
    cursor: Number(req.query.cursor || 0),
    limit: 20,
    category: req.query.category,
    search: req.query.search,
    sort: req.query.sort
  };

  const cacheKey = `products:${JSON.stringify(filters)}`;
  const cached = await redis.get(cacheKey);

  // return cached response
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const products = await getProducts(filters);

  const nextCursor =
    products.length > 0 ? products[products.length - 1].id : null;

  const response = {
    data: products,
    nextCursor,
    hasMore: products.length === filters.limit
  };

  await redis.set(cacheKey, JSON.stringify(response), {
    EX: 60
  });

  res.json(response);
});

module.exports = router;
