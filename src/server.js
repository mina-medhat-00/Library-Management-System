import express from "express";
import "dotenv/config";
import sequelize from "./config/db.js";
import borrowerRouter from "./routes/borrowerRoute.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use("/api/v1/borrowers", borrowerRouter);

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
    console.error("Unable to connect to the database:", error);
  });
