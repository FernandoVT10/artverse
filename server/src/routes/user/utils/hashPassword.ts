import bcrypt from "bcrypt";

import LoggerHandler from "@utils/LoggerHandler";
import { ServerError } from "@utils/errors";

export const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (err) {
    LoggerHandler.logError(err);

    throw new ServerError();
  }
}

export default hashPassword;
