class AppError extends Error {
  statusCode;
  status;
  isOperational;

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // client errors are fail and server errors are error
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    // handled errors are operational
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
