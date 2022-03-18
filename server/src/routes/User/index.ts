import { Router } from "express";

const router = Router();

router.get("/hello", (_, res) => {
  res.send("hello").status(200);
});

export default router;
