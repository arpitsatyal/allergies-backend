import jwt, { Secret } from "jsonwebtoken";
import { IDecoded } from "../types/IDecoded";

const JWT_REFRESH: Secret = process.env.JWT_REFRESH;

export function verifyRefresh(id: number, token: string): boolean {
  let isValidToken: boolean;
  jwt.verify(token, JWT_REFRESH, (_, decoded: IDecoded) => {
    if (decoded.userId === id) {
      isValidToken = true;
    } else {
      isValidToken = false;
    }
  });
  return isValidToken;
}
