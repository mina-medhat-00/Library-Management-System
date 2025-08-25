import AppError from "../utils/app.error.js";

const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message, data: null });
  } else {
    res.status(500).json({
      status: "error",
      message: error ? error.message : "unexpected error",
      data: null,
    });
  }
};

export default errorHandler;
