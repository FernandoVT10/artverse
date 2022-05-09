import { ServerError } from "../errors";

import { FileFilterCallback } from "multer";

function imageFilter(
  _: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const { mimetype } = file;

  if (mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  cb(new ServerError("All files must be images"));
}

export default imageFilter;
