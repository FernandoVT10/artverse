import { Request, Response, NextFunction } from "express";
import { JWT_SECRET_KEY } from "@config/constants";
import { ServerError } from "@utils/errors";

import jwt, { JwtPayload, JsonWebTokenError } from "jsonwebtoken";

import LoggerHandler from "@utils/LoggerHandler";
import { User } from "@models";

function authorize(isRequired = false) {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        throw new ServerError("You don't have enough permissions");
      }

      const { userId } = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;

      const userExists = await User.count({
        where: { id: userId },
      });

      if (!userExists) {
        throw new ServerError();
      }

      req.userId = userId;
      next();
    } catch (err) {
      if (!isRequired) {
        return next();
      }

      if (err instanceof ServerError) {
        next(err);
      } else if (err instanceof JsonWebTokenError) {
        next(new ServerError("The credentials are invalid"));
      } else {
        LoggerHandler.logError(err);
        next(new ServerError());
      }
    }
  };
}

export default authorize;
