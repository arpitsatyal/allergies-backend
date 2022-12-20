import { RequestHandler } from "express";

export const validateBody = (schema): RequestHandler => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {});
    error ? next({ msg: error.details[0].message }) : next();
  };
};
