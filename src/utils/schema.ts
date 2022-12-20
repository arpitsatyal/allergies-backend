import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(5),
  role: Joi.string()
});

export const allergySchema = Joi.object({
  name: Joi.string().required().max(25),
  severity: Joi.string().required().max(20),
  image: Joi.string(),
  highRisk: Joi.bool(),
  symptoms: Joi.array().required().items(Joi.string()),
  comment: Joi.string(),
});

export const updateAllergySchema = Joi.object({
  name: Joi.string().max(25),
  severity: Joi.string().max(20),
  image: Joi.string(),
  highRisk: Joi.bool(),
  symptoms: Joi.array().items(Joi.string()),
  comment: Joi.string(),
});
