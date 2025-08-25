import express from "express";
import {
  createBorrower,
  getAllBorrowers,
  getBorrowerById,
  updateBorrower,
  deleteBorrower,
} from "../controllers/borrower.controller.js";

const router = express.Router();

router.get("/", getAllBorrowers);
router.get("/:id", getBorrowerById);
router.post("/", createBorrower);
router.put("/:id", updateBorrower);
router.delete("/:id", deleteBorrower);

export default router;
