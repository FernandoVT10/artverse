import LoggerHandler from "../LoggerHandler";

import logger from "@config/logger";

jest.mock("@config/logger");

describe("utils/LoggerHandler", () => {
  const mockedLogger = jest.mocked(logger);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("method logError", () => {
    it("should call 'logger.error' with the given error", () => {
      const error = new Error("test");
      LoggerHandler.logError(error);
      expect(mockedLogger.error).toHaveBeenCalledWith(error);
    });
  });

  describe("method logWarn", () => {
    it("should call 'logger.warn' with the given warning", () => {
      const warningMessage = "message";
      LoggerHandler.logWarn(warningMessage);
      expect(mockedLogger.warn).toHaveBeenCalledWith(warningMessage);
    });
  });

  describe("method logInfo", () => {
    it("should call 'logger.info' with the given info parameter", () => {
      const infoMessage = "message";
      LoggerHandler.logInfo(infoMessage);
      expect(mockedLogger.info).toHaveBeenCalledWith(infoMessage);
    });
  });
});
