import prisma from "../db/client";
import { IUser } from "./../types/index";
import { exclude } from "../utils/excludeField";
import { handleError } from "../utils/handleError";
import { passwordHash, decryptPassword } from "../utils/passwordHash";
import { createAccessToken, createRefreshToken } from "../utils/createTokens";

export const login = (body: IUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = body;
      if (!email || !password) {
        return reject({
          msg: "please enter email and password.",
        });
      }
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reject({ msg: "invalid email or password" });
      }
      if (user) {
        const decryptedPassword = await decryptPassword(user.password);
        if (decryptedPassword !== password) {
          return reject({ msg: "invalid email or password" });
        }
      }
      const accessToken = createAccessToken({ userId: user.id });
      const refreshToken = createRefreshToken({ userId: user.id });

      const userWithoutPassword = exclude(user, "password");
      resolve({
        data: { accessToken, refreshToken, user: userWithoutPassword },
        message: "Logged in successfully...",
      });
    } catch (e) {
      reject(handleError(e));
    }
  });
};

export const register = (body: IUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, email, password, role } = body;

      const allowedRoles = ["user", "admin"];
      if (role && !allowedRoles.includes(role)) {
        return reject({
          msg: "sorry, that role is not allowed. please contact the administrator.",
        });
      }

      const hashedPassword = await passwordHash(password);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
      const userWithoutPassword = exclude(user, "password");
      resolve({
        data: { user: userWithoutPassword },
        message: "sign up completed successfully...",
      });
    } catch (e) {
      reject(handleError(e));
    }
  });
};

export function getUser(userId: number) {
  return new Promise((resolve, reject) => {
    prisma.user
      .findFirst({
        where: {
          id: userId,
        },
        include: {
          allergies: true
        }
      })
      .then((user) => {
        if (!user) {
          return reject({ msg: "no such user exists." });
        }
        const userWithoutPassword = exclude(user, "password");
        resolve(userWithoutPassword);
      })
      .catch((err) => reject(handleError(err)));
  });
}

export function getAllUsers() {
  return new Promise((resolve, reject) => {
    prisma.user
      .findMany()
      .then((users) => {
        if (users.length) {
          const usersWithoutPassword = users.map((user) =>
            exclude(user, "password")
          );
          resolve(usersWithoutPassword);
        } else {
          resolve(users);
        }
      })
      .catch((err) => reject(handleError(err)));
  });
}
