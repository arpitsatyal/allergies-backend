import { Response, NextFunction } from "express";
import { CustomUserRequest } from "./authenticate";

export const checkUserExists = async (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
) => {
    const userId = req.user?.id;
    if (!userId) {
      return next({ msg: "error processing your request. try again later." });
    }
  next();
};
