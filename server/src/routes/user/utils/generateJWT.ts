import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "@config/constants";

function generateJWT(payload: string | Buffer | object): string {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
}

export default generateJWT;
