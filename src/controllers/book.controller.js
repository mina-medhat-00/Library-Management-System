import AppError from "../utils/app.error.js";
import Book from "../models/book.model.js";

export const getAllBooks = async (req, res, next) => {
  // pagination handles negative and non-numeric values
  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  // max limit is 100 items
  const limit =
    parseInt(req.query.limit) > 0
      ? Math.min(parseInt(req.query.limit), 100)
      : 10;

  try {
    const books = await Book.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
    });
    res.status(200).json({
      status: "success",
      message: "Books retrieved successfully",
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
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const createBook = async (req, res, next) => {
  const { title, author, isbn, available_quantity, shelf_location } = req.body;

  try {
    const book = await Book.create({
      title,
      author,
      isbn,
      available_quantity,
      shelf_location,
    });
    res.status(201).json({
      status: "success",
      message: "Book created successfully",
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
      message: "Book updated successfully",
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
