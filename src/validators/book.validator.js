import Joi from "joi";

export const createBookSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  author: Joi.string().min(3).max(100).required(),
  isbn: Joi.string().length(13).required(),
  availableQuantity: Joi.number().integer().min(0).required(),
  shelfLocation: Joi.string(),
});

export const updateBookSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  author: Joi.string().min(3).max(100),
  isbn: Joi.string().length(13),
  availableQuantity: Joi.number().integer().min(0),
  shelfLocation: Joi.string(),
});
