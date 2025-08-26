import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from "sequelize";
import AppError from "../utils/app.error.js";

/**
 * Middleware for centralized error handling.
 *
 * Handles custom AppError instances, Sequelize validation errors.
 *
 * Fallback error for unexpected errors
 */
const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message, data: null });
  } else if (
    error instanceof ValidationError ||
    error instanceof UniqueConstraintError ||
    error instanceof ForeignKeyConstraintError
  ) {
    res.status(400).json({
      status: "fail",
      message: error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      })),
      data: null,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: error ? error.message : "Unexpected error",
      data: null,
    });
  }
};

export default errorHandler;
