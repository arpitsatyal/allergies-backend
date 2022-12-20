import { Response, NextFunction } from "express";
import { CustomUserRequest } from "./authenticate";

export const authorize = async (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return next({ msg: "you are not authorized to view this route!" });
  }
  next();
};
