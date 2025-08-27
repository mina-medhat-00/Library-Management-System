import { Op } from "sequelize";
import AppError from "../utils/app.error.js";
import Book from "../models/book.model.js";

/**
 * @swagger
 * /api/v1/books/search:
 *   get:
 *     summary: Search for books by title, author, or ISBN
 *     description: >
 *       Allows searching for books with optional filters.
 *       Supports pagination with `page` and `limit` query params.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter books by title (partial match)
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter books by author (partial match)
 *       - in: query
 *         name: isbn
 *         schema:
 *           type: string
 *         description: Filter books by ISBN (exact or partial match)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Number of results per page (max 100)
 *     responses:
 *       200:
 *         description: Books retrieved successfully
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
 *                   example: 5 books found
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *       400:
 *         description: Invalid or missing search parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Please provide search parameters
 *       500:
 *         description: Internal server error
 */
export const searchBooks = async (req, res, next) => {
  const { title, author, isbn } = req.query;
  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;

  try {
    if (limit > 100) {
      return next(new AppError("Cannot exceed 100 books", 400));
    }

    const conditions = [];

    if (title) conditions.push({ title: { [Op.like]: `%${title.trim()}%` } });
    if (author)
      conditions.push({ author: { [Op.like]: `%${author.trim()}%` } });
    if (isbn) conditions.push({ isbn: { [Op.like]: isbn.trim() } });

    if (conditions.length === 0) {
      return next(new AppError("Please provide search parameters", 400));
    }

    const books = await Book.findAndCountAll({
      where: { [Op.or]: conditions },
      limit,
      offset: (page - 1) * limit,
    });

    res.status(200).json({
      status: "success",
      message: `${books.count} books found`,
      data: books.rows,
      pagination: { page, limit, total: books.count },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *     responses:
 *       200:
 *         description: List of books retrieved
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
 *                   example: Books retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 100
 */
export const getAllBooks = async (req, res, next) => {
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
      data: books.rows,
      pagination: { page, limit, total: books.count },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
export const getBookById = async (req, res, next) => {
  const id = Number(req.params.id);

  try {
    if (isNaN(id)) {
      return next(new AppError("ID must be a number", 400));
    }

    const book = await Book.findByPk(id);
    if (!book) {
      return next(new AppError("Book not found", 404));
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

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - isbn
 *               - availableQuantity
 *               - shelfLocation
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               availableQuantity:
 *                 type: integer
 *               shelfLocation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
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

/**
 * @swagger
 * /api/v1/books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 */
export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return next(new AppError("Book not found", 404));
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

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
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
