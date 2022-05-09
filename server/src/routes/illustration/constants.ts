import path from "path";
import { IMAGES_DIR } from "@config/constants";
import { Size } from "@utils/images/saveAndResizeMulterFileAsImage";

export const ILLUSTRATIONS_DESTINATION = path.resolve(
  IMAGES_DIR,
  "./illustrations/"
);

export const ILLUSTRATIONS_SIZES: Size[] = [
  {
    width: 250,
    height: 250,
    suffix: "thumbnail",
  },
];
