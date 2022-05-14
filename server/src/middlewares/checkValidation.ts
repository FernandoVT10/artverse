import { NextFunction, Request, Response } from "express";
import { validationResult, ValidationError } from "express-validator";

export const errorFormater = ({ msg, param }: ValidationError) => ({
  message: msg,
  field: param,
});

function checkValidation() {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(errorFormater);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array({ onlyFirstError: true }),
      });
    }

    return next();
  };
}

export default checkValidation;
