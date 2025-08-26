import Joi from "joi";

export const createBookSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  author: Joi.string().min(3).max(100).required(),
  isbn: Joi.string().length(13).required(),
  available_quantity: Joi.number().integer().min(0).required(),
  shelf_location: Joi.string(),
});

export const updateBookSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  author: Joi.string().min(3).max(100),
  isbn: Joi.string().length(13),
  available_quantity: Joi.number().integer().min(0),
  shelf_location: Joi.string(),
});
