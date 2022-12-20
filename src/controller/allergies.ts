import { NextFunction, Request, Response } from "express";

import { IAllergy } from "./../types/index";
import * as allergyService from "../services/allergies";
import { CustomUserRequest } from "../middlewares/authenticate";
import { uploadImage, uploadFromBuffer } from "../utils/uploadImage";

export const getAllergies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageSize = +req.query.pagesize || 10;
    const currentPage = +req.query.page || 1;

    const allAllergies = await allergyService.getAll({
      pageSize,
      currentPage,
    });
    res.status(200).json(allAllergies);
  } catch (e) {
    next(e);
  }
};

export const getAllergy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allergy = await allergyService.getOne(+req.params.id);
    res.status(200).json(allergy);
  } catch (e) {
    next(e);
  }
};

export const createAllergy = async (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const newAllergy = await allergyService.create(req.body, userId);
    res.status(201).json(newAllergy);
  } catch (e) {
    next(e);
  }
};

export const updateAllergy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedAllergy = await allergyService.update(
      +req.params.id,
      req.body
    );
    res.status(200).json(updatedAllergy);
  } catch (e) {
    next(e);
  }
};

export const deleteAllergy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await allergyService.remove(+req.params.id);
    res.status(204).json(null);
  } catch (e) {
    next(e);
  }
};

export const markAsHighRisk = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedAllergy = await allergyService.markAsHighRisk(
      req.body,
      +req.params.id
    );
    res.status(200).json({
      data: updatedAllergy,
    });
  } catch (e) {
    next(e);
  }
};

export const imageUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result: string;
    if ((req as any).files && (req as any).files.image) {
      const file = (req as any).files.image;
      result = await uploadFromBuffer(file.data);
    } else {
      result = await uploadImage(req.body.image);
    }

    res.status(200).json(result);
  } catch (e) {
    next({ msg: e.message });
  }
};

export const searchAllergy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.body;
    let searchedAllergy: IAllergy[];
    if (query) {
      searchedAllergy = await allergyService.search(query);
    } else {
      searchedAllergy = await allergyService.getAll({
        pageSize: 3,
        currentPage: 1,
      });
    }
    res.status(200).json(searchedAllergy);
  } catch (e) {
    next(e);
  }
};

export const addComment = async (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentData = {
      comment: req.body.comment,
      addedBy: {
        name: req.user.name,
        id: req.user.id,
      },
      createdAt: new Date(Date.now()),
    };
    const updatedAllergy = await allergyService.addComment(
      +req.params.id,
      commentData
    );
    res.status(200).json(updatedAllergy);
  } catch (e) {
    next(e);
  }
};

export const deleteComment = async (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { comment, createdAt } = req.body;
    const commentData = {
      comment,
      createdAt,
      addedBy: {
        name: req.user.name,
        id: req.user.id,
      },
    };
    const updatedAllergy = await allergyService.deleteComment(
      +req.params.id,
      commentData
    );
    res.status(200).json(updatedAllergy);
  } catch (e) {
    next(e);
  }
};

export const getComments = async (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const queriedComments = await allergyService.getComments(+req.params.id);
    res.status(200).json(queriedComments);
  } catch (e) {
    next(e);
  }
};
