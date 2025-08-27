import AppError from "../utils/app.error.js";
import Borrower from "../models/borrower.model.js";

/**
 * @swagger
 * /api/v1/borrowers:
 *   get:
 *     summary: Get all borrowers
 *     tags: [Borrowers]
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
 *         description: List of borrowers retrieved
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
 *                   example: Borrowers retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Borrower'
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
export const getAllBorrowers = async (req, res, next) => {
  // pagination handles negative and non-numeric values
  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;

  try {
    if (limit > 100) {
      return next(new AppError("Cannot exceed 100 borrowers", 400));
    }
    const borrowers = await Borrower.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
    });
    res.status(200).json({
      status: "success",
      message: "Borrowers retrieved",
      data: borrowers,
      pagination: { page, limit, total: borrowers.count },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/borrowers/{id}:
 *   get:
 *     summary: Get a borrower by ID
 *     tags: [Borrowers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrower ID
 *     responses:
 *       200:
 *         description: Borrower retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Borrower'
 *       404:
 *         description: Borrower not found
 */
export const getBorrowerById = async (req, res, next) => {
  const id = Number(req.params.id);

  try {
    if (isNaN(id)) {
      return next(new AppError("ID must be a number", 400));
    }

    const borrower = await Borrower.findByPk(id);
    if (!borrower) {
      return next(new AppError("Borrower not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Borrower retrieved",
      data: borrower,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/borrowers:
 *   post:
 *     summary: Create a new borrower
 *     tags: [Borrowers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Smith
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *     responses:
 *       201:
 *         description: Borrower created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Borrower'
 */
export const createBorrower = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const borrower = await Borrower.create({ name, email });
    res.status(201).json({
      status: "success",
      message: "Borrower created",
      data: borrower,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/borrowers/{id}:
 *   put:
 *     summary: Update borrower by ID
 *     tags: [Borrowers]
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
 *             $ref: '#/components/schemas/Borrower'
 *     responses:
 *       200:
 *         description: Borrower updated successfully
 *       404:
 *         description: Borrower not found
 */
export const updateBorrower = async (req, res, next) => {
  const id = Number(req.params.id);

  try {
    if (isNaN(id)) {
      return next(new AppError("ID must be a number", 400));
    }

    const borrower = await Borrower.findByPk(id);
    if (!borrower) {
      return next(new AppError("Borrower not found", 404));
    }
    await borrower.update(req.body);
    res.status(200).json({
      status: "success",
      message: "Borrower updated",
      data: borrower,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/borrowers/{id}:
 *   delete:
 *     summary: Delete borrower by ID
 *     tags: [Borrowers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Borrower deleted successfully
 *       404:
 *         description: Borrower not found
 */
export const deleteBorrower = async (req, res, next) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) {
      return next(new AppError("Borrower not found", 404));
    }
    await borrower.destroy();
    res
      .status(200)
      .json({ status: "success", message: "Borrower deleted", data: borrower });
  } catch (error) {
    next(error);
  }
};
