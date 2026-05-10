const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allow the Next.js client to send cookies cross-origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // required for cookies
  })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Cookie Parser ────────────────────────────────────────────────────────────
app.use(cookieParser());

// ─── Logger ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", routes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({ message: "CampusHub Server is running 🚀" });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(`[ERROR] ${err.message}`);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
