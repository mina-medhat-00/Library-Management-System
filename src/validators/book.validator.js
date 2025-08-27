import Joi from "joi";

export const createBookSchema = Joi.object({
  title: Joi.string().min(3).max(100).trim().required(),
  author: Joi.string().min(3).max(100).trim().required(),
  isbn: Joi.string().length(13).trim().required(),
  availableQuantity: Joi.number().integer().min(0).required(),
  shelfLocation: Joi.string().max(5).trim(),
});

export const updateBookSchema = Joi.object({
  title: Joi.string().min(3).max(100).trim(),
  author: Joi.string().min(3).max(100).trim(),
  isbn: Joi.string().length(13).trim(),
  availableQuantity: Joi.number().integer().min(0),
  shelfLocation: Joi.string().max(5).trim(),
});
