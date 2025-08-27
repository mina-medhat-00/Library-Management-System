import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Op } from "sequelize";
import { createObjectCsvStringifier } from "csv-writer";
import AppError from "../utils/app.error.js";
import Borrowing from "../models/borrowing.model.js";
import Book from "../models/book.model.js";
import Borrower from "../models/borrower.model.js";

// required for csv reports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * /api/v1/borrowings/borrow:
 *   post:
 *     summary: Borrow a book
 *     description: Allows a borrower to check out a book if available.
 *     tags:
 *       - Borrowings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 1
 *               borrowerId:
 *                 type: integer
 *                 example: 2
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-10
 *     responses:
 *       201:
 *         description: Book successfully borrowed
 *       404:
 *         description: Book or Borrower not found
 *       409:
 *         description: Book not available
 */
export const borrowBook = async (req, res, next) => {
  const { bookId, borrowerId, dueDate } = req.body;

  try {
    // check if book exists
    const book = await Book.findByPk(bookId);
    const borrower = await Borrower.findByPk(borrowerId);
    if (!book || !borrower) {
      return next(new AppError("Book or Borrower not found", 404));
    }
    // check if no books available for rent
    const activeBorrows = await Borrowing.count({
      where: { bookId: bookId, status: "borrowed" },
    });
    if (book.availableQuantity <= activeBorrows) {
      return next(
        new AppError("Book currently not available for borrowing", 409)
      );
    }
    // update available quantity for valid borrowing
    await book.update({ availableQuantity: book.availableQuantity - 1 });

    const borrowing = await Borrowing.create({
      bookId: bookId,
      borrowerId: borrowerId,
      dueDate,
      status: "borrowed",
    });

    res.status(201).json({
      status: "success",
      message: "Check-out successful",
      data: borrowing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/borrowings/return:
 *   post:
 *     summary: Return a borrowed book
 *     description: Updates the borrowing record and marks the book as returned or overdue if past due date.
 *     tags:
 *       - Borrowings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 1
 *               borrowerId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Book successfully returned or marked as overdue
 *       404:
 *         description: Book or borrowing record not found
 *       500:
 *         description: Internal server error
 */
export const returnBook = async (req, res, next) => {
  const { bookId, borrowerId } = req.body;

  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      return next(new AppError("Book not found", 404));
    }
    // find only borrowed books
    const borrowing = await Borrowing.findOne({
      where: { bookId: bookId, borrowerId: borrowerId, status: "borrowed" },
    });
    if (!borrowing) {
      return next(new AppError("Borrowing record not found", 404));
    }
    // check if returned book is overdue
    const updatedStatus =
      borrowing.dueDate < new Date() ? "overdue" : "returned";
    await borrowing.update({ status: updatedStatus, returnDate: new Date() });

    await book.update({ availableQuantity: book.availableQuantity + 1 });
    res.status(200).json({
      status: "success",
      message: "Book status updated",
      data: borrowing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/borrowings/borrower/{id}:
 *   get:
 *     summary: Get borrowed books for a borrower
 *     description: Retrieve all currently borrowed books for a specific borrower.
 *     tags:
 *       - Borrowings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the borrower
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: List of borrowed books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Borrowed books retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "The Great Gatsby"
 *                       author:
 *                         type: string
 *                         example: "F. Scott Fitzgerald"
 *                       isbn:
 *                         type: string
 *                         example: "9780743273565"
 *                       shelfLocation:
 *                         type: string
 *                         example: "A2-5"
 *       404:
 *         description: Borrower not found
 *       500:
 *         description: Internal server error
 */
export const getBorrowerBooks = async (req, res, next) => {
  try {
    const borrowedBooks = await Borrowing.findAll({
      where: { borrowerId: req.params.id, status: "borrowed" },
      include: [
        {
          model: Book,
          attributes: ["title", "author", "isbn", "shelfLocation"],
        },
      ],
    });

    if (borrowedBooks.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No borrowed books found",
        data: [],
      });
    }

    res.status(200).json({
      status: "success",
      message: "Borrowed books retrieved",
      data: borrowedBooks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/borrowings/overdue:
 *   get:
 *     summary: Get overdue books
 *     description: Retrieve all books that are overdue or still borrowed beyond their due date.
 *     tags:
 *       - Borrowings
 *     responses:
 *       200:
 *         description: Overdue books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Overdue books retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Book:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: "The Great Gatsby"
 *                           author:
 *                             type: string
 *                             example: "F. Scott Fitzgerald"
 *                           isbn:
 *                             type: string
 *                             example: "9780743273565"
 *                           shelfLocation:
 *                             type: string
 *                             example: "A2-5"
 *                       Borrower:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "johndoe@example.com"
 *                       dueDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-15T00:00:00.000Z"
 *                       status:
 *                         type: string
 *                         enum: [borrowed, overdue]
 *                         example: overdue
 *       500:
 *         description: Internal server error
 */
export const getOverdueBooks = async (_, res, next) => {
  try {
    const overdueBooks = await Borrowing.findAll({
      where: {
        status: { [Op.in]: ["borrowed", "overdue"] },
        dueDate: { [Op.lt]: new Date() },
      },
      include: [
        {
          model: Book,
          attributes: ["title", "author", "isbn", "shelfLocation"],
        },
        {
          model: Borrower,
          attributes: ["name", "email"],
        },
      ],
    });

    if (overdueBooks.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No overdue books found",
        data: [],
      });
    }

    res.status(200).json({
      status: "success",
      message: "Overdue books retrieved",
      data: overdueBooks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/borrowings/report:
 *   get:
 *     summary: Export borrowings report
 *     description: Generate and export a CSV report of all borrowings within a specified date range.
 *     tags:
 *       - Borrowings
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (inclusive) for filtering borrowings (YYYY-MM-DD).
 *         example: "2025-08-01"
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (inclusive) for filtering borrowings (YYYY-MM-DD).
 *         example: "2025-08-27"
 *     responses:
 *       200:
 *         description: Report exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Report exported successfully
 *                 data:
 *                   type: string
 *                   example: reports/borrowings-1693159023456.csv
 *       400:
 *         description: Invalid or missing query parameters
 *       500:
 *         description: Internal server error
 */
export const exportBorrowingsReport = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    const borrowings = await Borrowing.findAll({
      where: {
        borrowDate: {
          [Op.between]: [new Date(start), new Date(end)],
        },
      },
      include: [
        { model: Book, attributes: ["title"] },
        { model: Borrower, attributes: ["name", "email"] },
      ],
    });

    const stringfier = createObjectCsvStringifier({
      header: [
        { id: "borrower", title: "Borrower" },
        { id: "email", title: "Email" },
        { id: "book", title: "Book" },
        { id: "borrowedAt", title: "Borrowed At" },
        { id: "returnedAt", title: "Returned At" },
      ],
    });

    const records = borrowings.map((record) => ({
      borrower: record.Borrower.name,
      email: record.Borrower.email,
      book: record.Book.title,
      borrowedAt: record.borrowedAt,
      returnedAt: record.returnedAt,
    }));

    const csv =
      stringfier.getHeaderString() + stringfier.stringifyRecords(records);

    const exportDir = path.join(__dirname, "../../reports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    const filename = `borrowings-${Date.now()}.csv`;
    const filepath = path.join(exportDir, filename);

    fs.writeFileSync(filepath, csv);

    res.status(200).json({
      status: "success",
      message: "Report exported successfully",
      data: filepath,
    });
  } catch (error) {
    next(error);
  }
};
