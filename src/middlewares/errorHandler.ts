import { Request, Response, NextFunction } from "express";

import logger from "../utils/logger";
import { IError } from "../types/IError";

export function errorHandler(
  error: IError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(error.msg ?? error);
  res.status(error.statusCode || 400).json({ error: error.msg });
}
