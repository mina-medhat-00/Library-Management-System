import Joi from "joi";

export const borrowBookSchema = Joi.object({
  bookId: Joi.number().integer().required(),
  borrowerId: Joi.number().integer().required(),
  dueDate: Joi.date().greater("now").required().messages({
    "date.greater": "due date must be later than current date.",
  }),
});

export const returnBookSchema = Joi.object({
  bookId: Joi.number().integer().required(),
  borrowerId: Joi.number().integer().required(),
});
