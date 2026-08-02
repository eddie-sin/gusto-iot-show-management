const express = require("express");
const morgan = require("morgan");

const projectShowRouter = require("./routes/projectShowRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorControllers");

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Simple test route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "GUSTO IoT Show Management API is running",
    environment: process.env.NODE_ENV,
  });
});

// Project-show routes
app.use("/api/v1/project-shows", projectShowRouter);

// Authentication and Academic Head user-management routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Handle unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
