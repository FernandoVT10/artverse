import type { ErrorRequestHandler } from "express";

import { ServerError, ValidationError } from "@utils/errors";

const DEFAULT_ERROR_MESSAGE =
  "There was an error trying to process your request. Please try again later.";

export default function errorHandler(): ErrorRequestHandler {
  return (err, _req, res, _next) => {
    const errors: object[] = [];

    if (err instanceof ValidationError) {
      errors.push({
        message: err.message,
        field: err.field,
      });
    } else if (err instanceof ServerError) {
      const message = err.message ? err.message : DEFAULT_ERROR_MESSAGE;

      errors.push({ message });
    } else {
      errors.push({
        message: DEFAULT_ERROR_MESSAGE,
      });
    }

    const statusCode = err?.statusCode || 500;
    return res.status(statusCode).json({ errors });
  };
}
