import express from "express";
import { createBorrower } from "../controllers/borrowerController.js";

const router = express.Router();

router.post("/", createBorrower);

export default router;
