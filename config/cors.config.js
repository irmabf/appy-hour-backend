const cors = require("cors");

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || "https://appy-hour.netlify.app",
  allowedHeaders: ["Content-Type"],
  credentials: true,
});

module.exports = corsMiddleware;
