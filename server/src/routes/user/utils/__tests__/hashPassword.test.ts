import bcrypt from "bcrypt";

import hashPassword, { SALT_ROUNDS } from "../hashPassword";

import { ServerError } from "@utils/errors";

import LoggerHandler from "@utils/LoggerHandler";

jest.mock("bcrypt");
jest.mock("@utils/LoggerHandler");

describe("routes/user/hashPassword", () => {
  const mockedHash = jest.mocked(bcrypt.hash);
  const mockedLogError = jest.mocked(LoggerHandler.logError);

  beforeEach(() => {
    mockedHash.mockClear();
    mockedLogError.mockClear();
  });

  it("should call 'bcrypt.hash' and return the result", async () => {
    const hashedPassword = "shhh";
    mockedHash.mockImplementationOnce(() => Promise.resolve(hashedPassword));

    expect(await hashPassword("password")).toBe(hashedPassword);
  });

  it("should call 'bcrypt.hash' with the correct parameters", async () => {
    mockedHash.mockImplementationOnce(() => Promise.resolve("shhh"));

    const password = "pass";
    await hashPassword(password);

    expect(mockedHash).toHaveBeenCalledWith(password, SALT_ROUNDS);
  });

  describe("when 'bcrypt.hash' throws an error", () => {
    it("should throw an error", async () => {
      mockedHash.mockImplementationOnce(() => Promise.reject());
      await expect(hashPassword("pass")).rejects.toThrow(new ServerError());
    });

    it("should call 'logger.error' with the error", async () => {
      const error = new Error("test error");
      try {
        mockedHash.mockImplementationOnce(() => Promise.reject(error));
        await hashPassword("pass");
      } catch {
        expect(mockedLogError).toHaveBeenCalledWith(error);
      }
    });
  });
});
