import { Op } from "sequelize";
import AppError from "../utils/app.error.js";
import Borrowing from "../models/borrowing.model.js";
import Book from "../models/book.model.js";
import Borrower from "../models/borrower.model.js";

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
