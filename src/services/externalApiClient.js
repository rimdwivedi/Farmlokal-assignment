const axios = require("axios");
const { getAccessToken } = require("../auth/oauthClient");
const CircuitBreaker = require("opossum");

const api = axios.create({
  baseURL: process.env.EXTERNAL_API_URL || "http://localhost:3000/external",
  timeout: 1000 // 1 second timeout as per requirements
});

// Circuit Breaker Options
const breakerOptions = {
  timeout: 3000, 
  errorThresholdPercentage: 50, // Open circuit if 50% of requests fail
  resetTimeout: 30000 // Wait 30s before trying again
};

async function fetchInventory() {
  const token = await getAccessToken();

  const breaker = new CircuitBreaker(async () => {
    return await api.get("/inventory", {
      headers: { Authorization: `Bearer ${token}` }
    });
  }, breakerOptions);

  // Fallback if API is down or Circuit is Open
  breaker.fallback(() => {
    return { data: { productId: null, stock: 0, status: "Service Unavailable" } };
  });

  const response = await breaker.fire();
  return response.data;
}

module.exports = { fetchInventory };