import { Router } from "express";
import { register, login } from "./controllers";

const router = Router();

router.post("/users/register", register.validate(), register.controller);
router.post("/users/login", login.validate(), login.controller);

export default router;
