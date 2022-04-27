import { body, ValidationChain } from "express-validator";

export function title(): ValidationChain {
  return body("title")
    .isString()
    .withMessage("The title must be a string")
    .notEmpty()
    .withMessage("The title is required")
    .isLength({ max: 100 })
    .withMessage("The title must have 100 or less characters");
}

export function description(): ValidationChain {
  return body("description")
    .isString()
    .withMessage("The description must be a string")
    .notEmpty()
    .withMessage("The description is required")
    .isLength({ max: 500 })
    .withMessage("The description must have 500 or less characters");
}
