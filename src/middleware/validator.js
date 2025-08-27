import AppError from "../utils/app.error.js";

/**
 * Middleware function handling joi validation
 *
 * Takes parameters as Joi schema and returns error of type AppError
 *
 * Error is then handled using ErrorHandler
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map((e) => e.message).join(",");
      return next(new AppError(message, 400));
    }
    next();
  };
};

export default validate;
