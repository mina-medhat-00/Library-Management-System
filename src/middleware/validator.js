import AppError from "../utils/app.error.js";

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
