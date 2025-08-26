import express from "express";
import validate from "../middleware/validator.js";
import {
  createBookSchema,
  updateBookSchema,
} from "../validators/book.validator.js";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", validate(createBookSchema), createBook);
router.patch("/:id", validate(updateBookSchema), updateBook);
router.delete("/:id", deleteBook);

export default router;
