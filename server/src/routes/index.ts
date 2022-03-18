import { Router } from "express";

import userRouter from "./User";

const router = Router();

router.use("/api", userRouter);

export default router;
