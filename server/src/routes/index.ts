import { Router } from "express";

import userRouter from "./user";
import illustrationRouter from "./illustration";

const router = Router();

router.use("/api", userRouter);
router.use("/api", illustrationRouter);

export default router;
