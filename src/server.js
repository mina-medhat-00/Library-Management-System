import express from "express";
import hpp from "hpp";
import "dotenv/config";
import sequelize from "./config/db.js";
import errorHandler from "./middleware/error.handler.js";
import bookRouter from "./routes/book.routes.js";
import borrowerRouter from "./routes/borrower.routes.js";
import borrowingRouter from "./routes/borrowing.routes.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(hpp());

// API routes
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/borrowers", borrowerRouter);
app.use("/api/v1/borrowings", borrowingRouter);

// fallback route for unknown routes
app.use("*", (req, res) => {
  res
    .status(404)
    .send({ status: "fail", message: "Route not found", data: null });
});

app.use(errorHandler);

// DB connect & server start
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database successfully");
    if (process.env.NODE_ENV !== "production") {
      return sequelize.sync();
    }
  })
  .then(() => {
    console.log("Database synchronized successfully");
    server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

let server;

const gracefulShutdown = () => {
  if (server) {
    server.close((err) => {
      if (err) {
        console.error("Error closing server:", err);
        return process.exit(1);
      }
      console.log("Server closed");
    });
  }

  sequelize.close().then(() => console.log("Database connection closed"));

  setTimeout(() => {
    console.error("Time limit exceeded, forcing shutdown");
    process.exit(1);
  }, 10000);
};

// graceful shutdown for unhandled exceptions and rejections
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception Occurred", error.stack || error);
  gracefulShutdown();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection", reason, promise);
  gracefulShutdown();
});
