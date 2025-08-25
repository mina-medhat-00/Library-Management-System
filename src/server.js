import express from "express";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
