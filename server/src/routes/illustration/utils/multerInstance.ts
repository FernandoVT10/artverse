import path from "path";
import createMulterInstance from "@utils/createMulterInstance";

import { IMAGES_DIR } from "@config/constants";

const imageDestination = path.resolve(IMAGES_DIR, "./illustrations/");

export default createMulterInstance(imageDestination);
