import express from "express";
import "dotenv/config";
import sequelize from "./config/db.config.js";
import errorHandler from "./middleware/error.handler.js";
import bookRouter from "./routes/book.routes.js";
import borrowerRouter from "./routes/borrower.routes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// API routes
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/borrowers", borrowerRouter);
// fallback route for unknown routes
app.use("*", (req, res) => {
  res.status(404).send({ status: "fail", message: "Route not found" });
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
