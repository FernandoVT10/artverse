import { Response } from "supertest";

export const assertError = (response: Response, statusCode: number) => {
  expect(response.statusCode).toBe(statusCode);

  const { errors } = response.body;
  expect(errors).toMatchSnapshot();
};

export const assertServerError = (response: Response) =>
  assertError(response, 500);

export const assertValidationError = (response: Response) =>
  assertError(response, 400);
