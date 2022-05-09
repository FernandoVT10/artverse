import type { Request, Response, NextFunction, RequestHandler } from "express";

import * as validators from "../utils/validators";

import { BaseError as SequelizeError } from "sequelize";
import { IllustrationImagesType } from "../Illustration";
import { createIllustration } from "../repositories";
import { saveAndResizeMulterFileAsImage } from "@utils/images";
import { ValidationError } from "@utils/errors";
import { ILLUSTRATIONS_DESTINATION, ILLUSTRATIONS_SIZES } from "../constants";

import checkValidation from "@middlewares/checkValidation";
import multerInstance from "@config/multer";
import convertPathsToURL from "@utils/convertPathsToURL";
import authorize from "@middlewares/authorize";
import LoggerHandler from "@utils/LoggerHandler";

export function middlewares(): RequestHandler[] {
  return [
    authorize(true),
    multerInstance.single("image"),

    validators.title(),
    validators.description(),
    checkValidation(),
  ];
}

export function validate(): RequestHandler[] {
  return [validators.title(), validators.description(), checkValidation()];
}

export async function controller(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      throw new ValidationError("The image is required", "image");
    }

    const imagesPaths = await saveAndResizeMulterFileAsImage(
      req.file,
      ILLUSTRATIONS_DESTINATION,
      ILLUSTRATIONS_SIZES
    );

    // here we convert the imagesPaths into url paths
    // e.g: /home/user/artverse/public/img/foo.webp -> https://domain.com/img/foo.webp
    const convertedPaths = convertPathsToURL(imagesPaths, req);

    const { title, description } = req.body;

    const createdIllustration = await createIllustration({
      userId: req.userId,
      title,
      description,
      images: convertedPaths as IllustrationImagesType,
    });

    res.json(createdIllustration);
  } catch (err) {
    if (err instanceof SequelizeError) {
      LoggerHandler.logError(err);
    }

    next(err);
  }
}
