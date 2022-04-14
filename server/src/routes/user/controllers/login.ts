import bcrypt from "bcrypt";

import { NextFunction, Request, Response, RequestHandler } from "express";
import { password, usernameOrEmail } from "../utils/validators";
import { ValidationError } from "@utils/errors";

import getUserByEmailOrUsername from "../repositories/getUserByEmailOrUsername";
import checkValidation from "@middlewares/checkValidation";
import generateJWT from "../utils/generateJWT";
import User from "../UserModel";

export function validate(): RequestHandler[] {
  return [usernameOrEmail(), password(), checkValidation()];
}

export async function controller(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = (await getUserByEmailOrUsername(usernameOrEmail)) as User;

    const { password: hashedPassword } = user;

    if (!(await bcrypt.compare(password, hashedPassword))) {
      throw new ValidationError("The password is incorrect", "password");
    }

    const payload = {
      userId: user.id,
    };

    const token = generateJWT(payload);

    return res.json(token);
  } catch (err) {
    return next(err);
  }
}
