import { NextFunction, Request, Response, RequestHandler } from "express";
import { createUser } from "../repositories";

import * as validators from "../utils/validators";
import hashPassword from "../utils/hashPassword";
import checkValidation from "@middlewares/checkValidation";

export function validate(): RequestHandler[] {
  return [
    validators.username(),
    validators.email(),
    validators.password(),
    checkValidation(),
  ];
}

export async function controller(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    const userData = {
      username,
      email,
      password: hashedPassword,
    };

    await createUser(userData);

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
}
