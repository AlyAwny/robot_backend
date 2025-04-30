const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const basicAuth = require("express-basic-auth");
const robotRouter = require("./routes/robot.routes");
require("dotenv").config();
 
const app = express();
 
// CORS Middleware
app.use((req, res, next) => {
  const allowedOrigins = ["https://robot-web-gui-git-master-aly-awnys-projects.vercel.app"];
  const origin = req.headers.origin;
 
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
 
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
 
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
 
  next();
});
 
// Basic Auth
app.use(
  basicAuth({
    users: { admin: process.env.BASIC_AUTH_PASSWORD || "defaultpassword" },
    unauthorizedResponse: (req) => "Invalid credentials",
  })
);
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 
// API Routes
app.use("/api/robot", robotRouter);
 
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🤖 Robot Web API is running!",
    timestamp: new Date().toISOString(),
  });
});
 
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});
 
module.exports = app;