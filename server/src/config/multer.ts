import multer from "multer";
import imageFilter from "@utils/multer/imageFilter";

const FILE_SIZE = 20000000; // ~ 20MB
const MAX_NUMBER_OF_FILES = 12;

const storage = multer.memoryStorage();

export default multer({
  storage,
  limits: {
    fileSize: FILE_SIZE,
    files: MAX_NUMBER_OF_FILES,
  },
  fileFilter: imageFilter,
});
