import AppError from "../utils/app.error.js";
import Book from "../models/book.model.js";

export const getAllBooks = async (req, res, next) => {
  // pagination handles negative and non-numeric values
  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;

  try {
    if (limit > 100) {
      return next(new AppError("Cannot exceed 100 books", 400));
    }
    const books = await Book.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
    });
    res.status(200).json({
      status: "success",
      message: "Books retrieved",
      data: books,
      pagination: { page, limit, total: books.count },
    });
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ status: "fail", data: "Book not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Book retrieved",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const createBook = async (req, res, next) => {
  const { title, author, isbn, availableQuantity, shelfLocation } = req.body;

  try {
    const book = await Book.create({
      title,
      author,
      isbn,
      availableQuantity,
      shelfLocation,
    });
    res.status(201).json({
      status: "success",
      message: "Book created",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res
        .status(404)
        .json({ status: "fail", message: "Book not found", data: null });
    }
    await book.update(req.body);
    res.status(200).json({
      status: "success",
      message: "Book data updated",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return next(new AppError("Book not found", 404));
    }
    await book.destroy();
    res
      .status(200)
      .json({ status: "success", message: "Book deleted", data: book });
  } catch (error) {
    next(error);
  }
};
