require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mockOauthRoutes = require("./routes/mockOauth");

const productRoutes = require("./routes/products");
const webhookRoutes = require("./routes/webhook");
const rateLimiter = require("./middlewares/ratelimit");
const externalApi = require("./mock/externalApi");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", require("./routes/testAuth"));
app.use("/external", externalApi);
app.use(rateLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/products", productRoutes);
app.use("/webhook", webhookRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});


app.use("/oauth", express.urlencoded({ extended: false }), mockOauthRoutes);
app.use("/test", require("./routes/externalTest"));

module.exports = app;
