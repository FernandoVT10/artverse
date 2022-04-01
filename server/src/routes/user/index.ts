import { Router } from "express";
import { register } from "./controllers";

const router = Router();

router.post("/users/register", register.validate(), register.controller);

export default router;
