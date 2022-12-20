import jwt from "jsonwebtoken";

export const createAccessToken = (data: any): string => jwt.sign(data, process.env.JWT_SECRET as string, {
    expiresIn: "365d",
  });

export const createRefreshToken = (data: any): string => jwt.sign(data, process.env.JWT_REFRESH as string);
