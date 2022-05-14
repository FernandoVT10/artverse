import { body, ValidationChain } from "express-validator";

export function title(): ValidationChain {
  return body("title")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("The title is required")
    .isString()
    .withMessage("The title must be a string")
    .isLength({ max: 100 })
    .withMessage("The title must have 100 or less characters");
}

export function description(): ValidationChain {
  return body("description")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("The description is required")
    .isString()
    .withMessage("The description must be a string")
    .isLength({ max: 500 })
    .withMessage("The description must have 500 or less characters");
}
