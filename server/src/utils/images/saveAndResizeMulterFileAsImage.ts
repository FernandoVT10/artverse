import path from "path";
import sharp from "sharp";
import LoggerHandler from "../LoggerHandler";

import { ServerError } from "../errors";

function generateImageName(): string {
  const randomNumber = Math.random() * 1e6; // a random number from 0 to one million

  const filename = `${Date.now()}-${randomNumber}`;

  return filename;
}

export type Size = {
  width: number;
  height: number;
  suffix: string;
};

type ImagesPaths = {
  [key: string]: string;
};

async function saveAndResizeMulterFileAsImage(
  file: Express.Multer.File,
  toSavePath: string,
  sizes: Size[],
  options = {
    saveOriginal: true,
  }
): Promise<ImagesPaths> {
  const imageName = generateImageName();
  const imagesPaths: ImagesPaths = {};

  try {
    const sharpInstance = sharp(file.buffer);

    if (options.saveOriginal) {
      // we want to save the original image including the type of image ( or extension )
      const ext = path.extname(file.originalname);
      const imagePath = path.resolve(toSavePath, imageName + ext);

      await sharpInstance.toFile(imagePath);
      imagesPaths.original = imagePath;
    }

    for (const size of sizes) {
      const { width, height, suffix } = size;

      const resizedImagePath = path.resolve(
        toSavePath,
        `${suffix}-${imageName}.webp`
      );

      await sharpInstance.resize(width, height).toFile(resizedImagePath);

      imagesPaths[suffix] = resizedImagePath;
    }

    return imagesPaths;
  } catch (err) {
    LoggerHandler.logError(err);
    throw new ServerError(
      "There was an error trying to save images. Try it later."
    );
  }
}

export default saveAndResizeMulterFileAsImage;
