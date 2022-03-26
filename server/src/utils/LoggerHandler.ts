/* eslint @typescript-eslint/no-explicit-any: "off" -- In this file we're gonna need to use the 'any' type */
import logger from "@config/logger";

class LoggerHandler {
  static logError(error: any) {
    logger.error(error);
  }

  static logWarn(warn: any) {
    logger.warn(warn);
  }

  static logInfo(infoMessage: any) {
    logger.info(infoMessage);
  }
}

export default LoggerHandler;
