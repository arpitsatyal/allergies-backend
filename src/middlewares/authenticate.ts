import jwt, { Secret } from "jsonwebtoken";
import { Request, RequestHandler } from "express";

import { IUser } from "../types/index";
import { getUser } from "../services/auth";
import { IDecoded } from "../types/IDecoded";

const SECRET_KEY: Secret = process.env.JWT_SECRET;

export interface CustomUserRequest extends Request {
  user: IUser;
}

export const authenticate: RequestHandler = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return next({ msg: "Token not provided." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded: IDecoded) => {
    if (err) {
      if (err.message === "jwt expired") {
        return next({ statusCode: 401, msg: err });
      }
      return next({ msg: err });
    } else {
      const userId = decoded.userId;

      getUser(userId)
        .then((currentUser: IUser) => {
          (req as CustomUserRequest).user = currentUser;
          next();
        })
        .catch((err) => next(err));
    }
  });
};
