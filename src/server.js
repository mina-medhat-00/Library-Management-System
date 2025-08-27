import express from "express";
import "dotenv/config";
import sequelize from "./config/db.js";
import errorHandler from "./middleware/error.handler.js";
import bookRouter from "./routes/book.routes.js";
import borrowerRouter from "./routes/borrower.routes.js";
import borrowingRouter from "./routes/borrowing.routes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// API routes
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/borrowers", borrowerRouter);
app.use("/api/v1/borrowings", borrowingRouter);
// fallback route for unknown routes
app.use("*", (req, res) => {
  res
    .status(404)
    .send({ status: "fail", message: "Route not found", date: null });
});

app.use(errorHandler);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database successfully");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Database synchronized successfully");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

const gracefulShutdown = () => {
  server.close((err) => {
    if (err) {
      console.error("Error closing HTTP server:", err);
      return process.exit(1);
    }
    console.log("HTTP server closed.");
  });

  // set fallback timeout forcing connection termination
  setTimeout(() => {
    console.error("Time limit exceeded, forcing shutdown!");
    process.exit(1);
  }, 10000);
};

process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception Occurred", error.stack || error);
  gracefulShutdown();
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection", reason, promise);
  gracefulShutdown();
});
