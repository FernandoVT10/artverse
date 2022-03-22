import path from "path";
import { Logger, createLogger, format, transports } from "winston";
import { LOGS_DIR } from "./constants";

// This is equals to 5MB
const MAX_LOG_FILE_SIZE = 5 * 1024 * 1024;
const MAX_LOG_FILES = 5;
const LOG_FILENAME = path.resolve(LOGS_DIR, "server.log");

const loggerCommonFormats = format.combine(
  format.timestamp(),
  format.errors({ stack: true })
);

const consoleFormat = format.printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] (${level}): ${stack || message}`;
});

function buildProductionLogger(): Logger {
  return createLogger({
    defaultMeta: { service: "user-service" },
    format: loggerCommonFormats,
    transports: [
      new transports.File({
        level: "info",
        format: format.json(),
        maxsize: MAX_LOG_FILE_SIZE,
        maxFiles: MAX_LOG_FILES,
        filename: LOG_FILENAME,
      }),
      new transports.Console({
        level: "debug",
        format: consoleFormat,
      }),
    ],
  });
}

function buildDevelopmentLogger(): Logger {
  return createLogger({
    defaultMeta: { service: "user-service" },
    format: loggerCommonFormats,
    transports: [
      new transports.Console({
        format: consoleFormat,
      }),
    ],
  });
}

export default process.env.NODE_ENV === "production"
  ? buildProductionLogger()
  : buildDevelopmentLogger();
