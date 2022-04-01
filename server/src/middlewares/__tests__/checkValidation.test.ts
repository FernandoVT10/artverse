import { validationResult } from "express-validator";

import checkValidation, { errorFormater } from "../checkValidation";

import mockExpress from "@test-utils/mockExpress";

jest.mock("express-validator");

describe("middlewares/checkValidation", () => {
  describe("errorFormater", () => {
    it("should return just the message and the field(or param)", () => {
      const validationErrorObject = {
        msg: "test error message",
        param: "test",
      } as any;

      expect(errorFormater(validationErrorObject)).toEqual({
        message: validationErrorObject.msg,
        field: validationErrorObject.param,
      });
    });
  });

  describe("checkValidation middleware", () => {
    const mockedValidationResult = jest.mocked(validationResult);
    const middleware = checkValidation();

    beforeEach(() => {
      mockedValidationResult.mockClear();
    });

    const mockValidationResult = (errors?: string[], isEmpty = false) => {
      const formatWith = jest.fn(() => ({
        isEmpty: () => isEmpty,
        array: () => errors,
      }));

      mockedValidationResult.mockImplementationOnce(
        () => ({ formatWith } as any)
      );

      return { formatWith };
    };

    it("should call 'validationResult.formatWith' with the 'errorFormater' function", () => {
      const { formatWith } = mockValidationResult();

      const { req, res, next } = mockExpress();
      middleware(req, res, next);

      expect(formatWith).toHaveBeenCalledWith(errorFormater);
    });

    describe("when there're validation errors", () => {
      it("should call 'res.status' with the error code 400", () => {
        mockValidationResult();

        const { req, res, next } = mockExpress();
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
      });

      it("should call 'res.json' with the errors given by the 'validationResult array' method", () => {
        const errors = ["error message"];
        mockValidationResult(errors);

        const { req, res, next } = mockExpress();
        middleware(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
          errors,
          success: false,
        });
      });
    });

    it("should call 'next' when there're no errors", () => {
      mockValidationResult([], true);

      const { req, res, next } = mockExpress();
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
