import { Router } from "express";
import { createIllustration } from "./controllers";

const router = Router();

router.post(
  "/illustrations/",
  createIllustration.middlewares(),
  createIllustration.controller
);

export default router;
