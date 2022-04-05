import { body, ValidationChain } from "express-validator";

import { checkIfAFieldExists } from "../repositories";

export async function checkIfUsernameIsAvailable(username: string) {
  if (await checkIfAFieldExists.checkUsername(username)) {
    throw new Error("The username already exists");
  }
}

export async function checkIfEmailIsAvailable(email: string) {
  if (await checkIfAFieldExists.checkEmail(email)) {
    throw new Error("The email already exists");
  }
}

export const username: ValidationChain = body("username")
  .isString()
  .withMessage("The username must be a string")
  .isLength({ min: 4, max: 30 })
  .withMessage("The username must have 4 or more characters")
  .custom(checkIfUsernameIsAvailable);

export const email: ValidationChain = body("email")
  .isEmail()
  .withMessage("The email is invalid")
  .custom(checkIfEmailIsAvailable);

export const password: ValidationChain = body(
  "password",
  "The password is required"
)
  .isString()
  .withMessage("The password must be a string")
  .not()
  .isEmpty();
