import express from "express";
import validate from "../middleware/validator.js";
import {
  createBorrowerSchema,
  updateBorrowerSchema,
} from "../validators/borrower.validator.js";
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
router.post("/", validate(createBorrowerSchema), createBorrower);
router.patch("/:id", validate(updateBorrowerSchema), updateBorrower);
router.delete("/:id", deleteBorrower);

export default router;
