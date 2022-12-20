import prisma from "../db/client";
import { IAllergy } from "../types/index";
import { handleError } from "../utils/handleError";

export const getAll = ({ pageSize, currentPage }): Promise<IAllergy[]> => {
  return new Promise((resolve, reject) => {
    prisma.allergies
      .findMany({
        skip: pageSize * (currentPage - 1),
        take: pageSize,
        orderBy: [
          {
            highRisk: "desc",
          },
          {
            name: "asc",
          },
        ],
      })
      .then((data) => resolve(data))
      .catch((err) => reject(handleError(err)));
  });
};

export const getOne = (id: number): Promise<IAllergy> => {
  return new Promise((resolve, reject) => {
    prisma.allergies
      .findUnique({ 
        where: { id },
      })
      .then(async (allergies) => {
        if (!allergies) {
          return reject({
            msg: "allergy not found.",
          });
        }
        resolve({
          ...allergies,
          comments: allergies.comments.reverse().slice(0, 5).reverse(),
        });
      })
      .catch((err) => reject(handleError(err)));
  });
};

export const create = async (
  body: IAllergy,
  userId: number
): Promise<IAllergy> => {
  return new Promise(async (resolve, reject) => {
    try {
      const allergy = await prisma.allergies.create({
        data: { ...body, userId },
      });
      resolve(allergy);
    } catch (e) {
      reject(handleError(e));
    }
  });
};

export const update = async (id: number, body: IAllergy): Promise<IAllergy> => {
  return new Promise(async (resolve, reject) => {
    try {
      const allergy = await getOne(id);

      if (!allergy) {
        return reject({ msg: "no such data exists." });
      }

      const updatedAllergy = await prisma.allergies.update({
        where: {
          id: allergy.id,
        },
        data: body,
      });
      resolve(updatedAllergy);
    } catch (e) {
      reject(handleError(e));
    }
  });
};

export const remove = (id: number): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const allergy = await getOne(id);
      if (!allergy) {
        return reject({ msg: "no such data exists." });
      }
      await prisma.allergies.delete({
        where: {
          id: allergy.id,
        },
      });
      resolve(true);
    } catch (e) {
      reject(handleError(e));
    }
  });
};

export const markAsHighRisk = (
  body: Pick<IAllergy, "highRisk">,
  allergyId: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    prisma.allergies
      .updateMany({
        where: {
          id: allergyId,
        },
        data: body,
      })
      .then((data) => resolve(data))
      .catch((err) => reject(handleError(err)));
  });
};

export const search = (query: string): Promise<IAllergy[]> => {
  return new Promise((resolve, reject) => {
    prisma.allergies
      .findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      })
      .then((data) => resolve(data))
      .catch((err) => reject(handleError(err)));
  });
};

export const addComment = (
  id: number,
  commentData: {
    comment: string;
    addedBy: { name: string; id: number };
    createdAt: any;
  }
): Promise<IAllergy> => {
  return new Promise(async (resolve, reject) => {
    try {
      const allergy = await getOne(id);
      if (!allergy) {
        return reject({ msg: "no such data exists." });
      }

      const updatedAllergy = await prisma.allergies.update({
        where: {
          id: allergy.id,
        },
        data: {
          comments: {
            push: commentData,
          },
        },
      });
      resolve(updatedAllergy);
    } catch (e) {
      reject(handleError(e));
    }
  });
};

export const deleteComment = (
  id: number,
  commentData: {
    comment: string;
    addedBy: { name: string; id: number };
    createdAt: any;
  }
): Promise<IAllergy> => {
  return new Promise(async (resolve, reject) => {
    try {
      const allergy = await getOne(id);
      if (!allergy) {
        return reject({ msg: "no such data exists." });
      }

      const allComments = await getComments(allergy.id);

      const { comment, addedBy, createdAt } = commentData;

      const updatedAllergy = await prisma.allergies.update({
        where: {
          id: allergy.id,
        },
        data: {
          comments: {
            set: allComments.comments.filter(
              (cmt: any) =>
                cmt.comment !== comment ||
                cmt.addedBy.id !== addedBy.id ||
                cmt.createdAt !== createdAt
            ),
          },
        },
      });
      resolve(updatedAllergy);
    } catch (e) {
      reject(handleError(e));
    }
  });
};

export const getComments = (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const allergy = await getOne(id);
      if (!allergy) {
        return reject({ msg: "no such data exists." });
      }

      const queriedComments = await prisma.allergies.findFirst({
        where: {
          id: allergy.id,
        },
        select: {
          comments: true,
        },
      });
      resolve(queriedComments);
    } catch (e) {
      reject(handleError(e));
    }
  });
};
