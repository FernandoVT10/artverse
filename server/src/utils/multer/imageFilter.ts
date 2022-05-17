import { ValidationError } from "../errors";

import { FileFilterCallback } from "multer";

function imageFilter(
  _: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const { mimetype, fieldname } = file;

  if (mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  cb(new ValidationError(`The field ${fieldname} must be an image`, fieldname));
}

export default imageFilter;
