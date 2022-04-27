import path from "path";
import multer, {
  Multer,
  Options,
  FileFilterCallback,
  diskStorage,
} from "multer";
import { ServerError } from "./errors";

const FILE_SIZE = 20000000; // ~ 20MB
const MAX_NUMBER_OF_FILES = 12;

export function imageFilter(
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

// this was copied from the multer DiskStorageOptions interface.
type FileNameCallback = (error: Error | null, filename: string) => void;

export function filename(
  _: Express.Request,
  file: Express.Multer.File,
  cb: FileNameCallback
): void {
  const ext = path.extname(file.originalname);
  const randomNumber = Math.random() * 1e6; // a random number from 0 to one million

  const filename = `${Date.now()}-${randomNumber}${ext}`;

  cb(null, filename);
}

function createMulterInstance(destination: string): Multer {
  const storage = diskStorage({
    destination,
    filename,
  });

  const options: Options = {
    storage,
    limits: {
      fileSize: FILE_SIZE,
      files: MAX_NUMBER_OF_FILES,
    },
    fileFilter: imageFilter,
  };

  return multer(options);
}

export default createMulterInstance;
