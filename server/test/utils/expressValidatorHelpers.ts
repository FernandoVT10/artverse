import { ValidationChain, validationResult } from "express-validator";

import mockExpress from "./mockExpress";

export const testExpressValidator = async (
  bodyData: any,
  validator: ValidationChain
): Promise<string[]> => {
  const { req, res } = mockExpress({
    bodyData,
  });

  await new Promise((resolve) => {
    const next = jest.fn(resolve);

    validator(req, res, next);
  });

  const errors = validationResult(req).formatWith(({ msg }) => msg);

  return errors.array();
};
