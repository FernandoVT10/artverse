import LoggerHandler from "@utils/LoggerHandler";
import errorHandler from "../errorHandler";
import mockExpress from "@test-utils/mockExpress";

import { ServerError, ValidationError } from "@utils/errors";

jest.mock("@utils/LoggerHandler");

describe("middlewares/checkValidation", () => {
  const callErrorHandler = (error: any = null) => {
    const expressMock = mockExpress();
    const { req, res, next } = expressMock;

    const handler = errorHandler();
    handler(error, req, res, next);

    return expressMock;
  };

  it("should call 'res.status' with code 500 by default", () => {
    const { res } = callErrorHandler();
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should call 'res.json' with a default error message", () => {
    const { res } = callErrorHandler();
    const { errors } = res.json.mock.calls[0][0];
    expect(errors).toMatchSnapshot();
  });

  it("should call 'logError' with the error when the error is neither ServerError nor ValidationError", () => {
    const error = new Error();
    callErrorHandler(error);

    const logErrorMocked = jest.mocked(LoggerHandler.logError);
    expect(logErrorMocked).toHaveBeenCalledWith(error);
  });

  describe("ServerError instance", () => {
    it("should call 'res.status' with code 500", () => {
      const error = new ServerError();
      const { res } = callErrorHandler(error);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should call 'res.json' with a default error message when the ServerError message isn't given", () => {
      const error = new ServerError();

      const { res } = callErrorHandler(error);

      const { errors } = res.json.mock.calls[0][0];
      expect(errors).toMatchSnapshot();
    });

    it("should call 'res.json' with the error message of ServerError when is given", () => {
      const error = new ServerError("test");

      const { res } = callErrorHandler(error);

      const { errors } = res.json.mock.calls[0][0];
      expect(errors).toContainEqual({
        message: error.message,
      });
    });
  });

  describe("ValidationError instance", () => {
    const error = new ValidationError("foo", "test");

    it("should call 'res.status' with code 400", () => {
      const { res } = callErrorHandler(error);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should call 'res.json' with the error and field values of ValidationError", () => {
      const { res } = callErrorHandler(error);

      const { errors } = res.json.mock.calls[0][0];
      expect(errors).toContainEqual({
        message: error.message,
        field: error.field,
      });
    });
  });
});
