import Joi from "joi";

export const createBorrowerSchema = Joi.object({
  name: Joi.string().min(3).max(50).trim().required(),
  email: Joi.string().email().trim().required(),
});

export const updateBorrowerSchema = Joi.object({
  name: Joi.string().min(3).trim().max(50),
  email: Joi.string().email().trim(),
});
