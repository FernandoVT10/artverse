import path from "path";
import sharp from "sharp";
import LoggerHandler from "../LoggerHandler";

import { ServerError } from "../errors";

type Size = {
  width: number;
  height: number;
  suffix: string;
};

type ImagesPaths = {
  [key: string]: string;
};

async function resizeImageFromPath(
  imagePath: string,
  sizes: Size[]
): Promise<ImagesPaths> {
  const imagesPaths: ImagesPaths = {};

  try {
    const sharpInstance = sharp(imagePath);

    const { name: imageName, dir: imageDir } = path.parse(imagePath);

    for (const size of sizes) {
      const { width, height, suffix } = size;

      const resizedImagePath = path.resolve(
        imageDir,
        `${suffix}-${imageName}.webp`
      );

      await sharpInstance.resize(width, height).toFile(resizedImagePath);

      imagesPaths[suffix] = resizedImagePath;
    }

    imagesPaths.original = imagePath;

    return imagesPaths;
  } catch (err) {
    LoggerHandler.logError(err);
    throw new ServerError("There was an error trying to save some images.");
  }
}

export default resizeImageFromPath;
