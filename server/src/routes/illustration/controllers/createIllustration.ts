import type { Request, Response, NextFunction, RequestHandler } from "express";

import * as validators from "../utils/validators";

import { IllustrationImagesType } from "../Illustration";
import { createIllustration } from "../repositories";
import { resizeImageFromPath } from "@utils/images";
import { ValidationError } from "@utils/errors";

import checkValidation from "@middlewares/checkValidation";
import multerInstance from "../utils/multerInstance";
import convertPathsToURL from "@utils/convertPathsToURL";
import authorize from "@middlewares/authorize";

export function middlewares(): RequestHandler[] {
  return [authorize(true), multerInstance.single("image")];
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

    const imagesPaths = await resizeImageFromPath(req.file.path, [
      {
        width: 250,
        height: 250,
        suffix: "thumbnail",
      },
    ]);

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
    next(err);
  }
}
