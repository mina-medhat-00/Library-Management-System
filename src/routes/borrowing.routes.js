import express from "express";
import validate from "../middleware/validator.js";
import {
  borrowBookSchema,
  returnBookSchema,
} from "../validators/borrowing.validator.js";
import {
  borrowBook,
  getBorrowerBooks,
  exportBorrowingsReport,
  getOverdueBooks,
  returnBook,
} from "../controllers/borrowing.controller.js";

const router = express.Router();

router.post("/", validate(borrowBookSchema), borrowBook);
router.patch("/", validate(returnBookSchema), returnBook);
router.get("/borrowed/:id", getBorrowerBooks);
router.get("/overdue", getOverdueBooks);
router.get("/report", exportBorrowingsReport);

export default router;
