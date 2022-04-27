import bcrypt from "bcrypt";

import { NextFunction, Request, Response, RequestHandler } from "express";
import { password, usernameOrEmail } from "../utils/validators";
import { ValidationError } from "@utils/errors";
import { User } from "@models";

import getUserByEmailOrUsername from "../repositories/getUserByEmailOrUsername";
import checkValidation from "@middlewares/checkValidation";
import generateJWT from "../utils/generateJWT";

const EXPIRATION_IN_30_DAYS = 30 * 24 * 60 * 60 * 1000;

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

    return res
      .cookie("token", token, {
        maxAge: EXPIRATION_IN_30_DAYS,
        sameSite: "strict",
        httpOnly: true,
      })
      .json({ success: true });
  } catch (err) {
    return next(err);
  }
}
