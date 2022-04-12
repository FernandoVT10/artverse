import { body, ValidationChain } from "express-validator";

import { checkIfUserExists } from "../repositories";

export async function checkIfUsernameIsAvailable(username: string) {
  if (await checkIfUserExists.checkByUsername(username)) {
    throw new Error("The username already exists");
  }
}
export function username(): ValidationChain {
  return body("username")
    .isString()
    .withMessage("The username must be a string")
    .isLength({ min: 4, max: 30 })
    .withMessage("The username must have 4 or more characters")
    .custom(checkIfUsernameIsAvailable);
}

export async function checkIfEmailIsAvailable(email: string) {
  if (await checkIfUserExists.checkByEmail(email)) {
    throw new Error("The email already exists");
  }
}
export function email(): ValidationChain {
  return body("email")
    .isEmail()
    .withMessage("The email is invalid")
    .custom(checkIfEmailIsAvailable);
}

export function password(): ValidationChain {
  return body("password", "The password is required")
    .isString()
    .withMessage("The password must be a string")
    .not()
    .isEmpty();
}

export async function checkIfUsernameOrEmailExists(usernameOrEmail: string) {
  const { checkByUsernameOrEmail } = checkIfUserExists;

  const exists = await checkByUsernameOrEmail(usernameOrEmail);

  if (!exists) {
    throw new Error("The username or email don't exist");
  }
}
export function usernameOrEmail(): ValidationChain {
  return body("usernameOrEmail", "The username or email is required")
    .isString()
    .withMessage("The username or email must be a string")
    .not()
    .isEmpty()
    .custom(checkIfUsernameOrEmailExists);
}
