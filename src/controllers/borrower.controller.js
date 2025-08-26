import Borrower from "../models/borrower.model.js";
import AppError from "../utils/app.error.js";

export const getAllBorrowers = async (req, res, next) => {
  // pagination handles negative and non-numeric values
  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  // max limit is 100 items
  const limit =
    parseInt(req.query.limit) > 0
      ? Math.min(parseInt(req.query.limit), 100)
      : 10;

  try {
    const borrowers = await Borrower.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
    });
    res.status(200).json({
      status: "success",
      message: "Borrowers retrieved successfully",
      data: borrowers,
      pagination: { page, limit, total: borrowers.count },
    });
  } catch (error) {
    next(error);
  }
};

export const getBorrowerById = async (req, res, next) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) {
      return next(new AppError("Borrower not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Borrower retrieved successfully",
      data: borrower,
    });
  } catch (error) {
    next(error);
  }
};

export const createBorrower = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const borrower = await Borrower.create({ name, email });
    res.status(201).json({
      status: "success",
      message: "Borrower created successfully",
      data: borrower,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBorrower = async (req, res, next) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) {
      return next(new AppError("Borrower not found", 404));
    }
    await borrower.update(req.body);
    res.status(200).json({
      status: "success",
      message: "Borrower updated successfully",
      data: borrower,
    });
  } catch (error) {
    next(error);
  }
};

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
