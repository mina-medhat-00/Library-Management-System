import AppError from "../utils/app.error.js";
import Borrower from "../models/borrower.model.js";

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
