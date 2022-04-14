import { testExpressValidator } from "@test-utils/expressValidatorHelpers";
import { ValidationChain } from "express-validator";
import { checkIfUserExists } from "../../repositories";

import generateRandomText from "@test-utils/generateRandomText";

import * as validators from "../validators";

jest.mock("../../repositories");

describe("routes/user/utils/validators", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testValidator = async (
    bodyData: any,
    validator: ValidationChain,
    error: string
  ) => {
    const errors = await testExpressValidator(bodyData, validator);

    expect(errors).toContain(error);
  };

  describe("username", () => {
    const testUsername = (username: any, error: string) =>
      testValidator({ username }, validators.username(), error);

    it("should return an error if not a string", async () => {
      await testUsername(1, "The username must be a string");
    });

    it("should return an error if it's shorter than 4", async () => {
      await testUsername("123", "The username must have 4 or more characters");
    });

    it("should return an error if it's larger than 30", async () => {
      await testUsername(
        generateRandomText(31),
        "The username must have 4 or more characters"
      );
    });

    describe("custom validator", () => {
      const mockedCheckByUsername = jest.mocked(
        checkIfUserExists.checkByUsername
      );

      it("should return an error when the custom validator throws", async () => {
        mockedCheckByUsername.mockResolvedValueOnce(true);
        await testUsername("admin", "The username already exists");
      });

      it("should call 'checkByUsername' with the given username", async () => {
        mockedCheckByUsername.mockResolvedValueOnce(false);
        const username = "test";

        await testExpressValidator(
          {
            username,
          },
          validators.username()
        );

        expect(mockedCheckByUsername).toHaveBeenCalledWith(username);
      });
    });
  });

  describe("email", () => {
    const testEmail = async (email: any, error: string) =>
      testValidator({ email }, validators.email(), error);

    it("should return an error when it's not an email", async () => {
      await testEmail("noemail.com", "The email is invalid");
    });

    describe("custom validator", () => {
      const mockedCheckByEmail = jest.mocked(checkIfUserExists.checkByEmail);

      it("should return an error when the custom validator throws", async () => {
        mockedCheckByEmail.mockResolvedValueOnce(true);

        await testEmail("foo@bar.com", "The email already exists");
      });

      it("should call 'checkByEmail' with the given email", async () => {
        mockedCheckByEmail.mockResolvedValueOnce(false);
        const email = "test";

        await testExpressValidator({ email }, validators.email());

        expect(mockedCheckByEmail).toHaveBeenCalledWith(email);
      });
    });
  });

  describe("password", () => {
    const testPassword = async (password: any, error: string) =>
      testValidator({ password }, validators.password(), error);

    it("should return an error if it's empty", async () => {
      await testPassword("", "The password is required");
    });

    it("should return an error if it's not a string", async () => {
      await testPassword(5, "The password must be a string");
    });
  });

  describe("usernameOrEmail", () => {
    const testUsernameOrEmail = async (usernameOrEmail: any, error: string) =>
      testValidator({ usernameOrEmail }, validators.usernameOrEmail(), error);

    it("should return an error if it's not a string", async () => {
      await testUsernameOrEmail(1, "The username or email must be a string");
    });

    it("should return an error if it's empty", async () => {
      await testUsernameOrEmail("", "The username or email is required");
    });

    describe("custom validator", () => {
      const mockedCheckByUsernameOrEmail = jest.mocked(
        checkIfUserExists.checkByUsernameOrEmail
      );

      it("should return an error when the custom validator throws", async () => {
        mockedCheckByUsernameOrEmail.mockResolvedValueOnce(false);

        await testUsernameOrEmail("foo", "The username or email don't exist");
      });

      it("should call 'checkByUsernameOrEmail' with the given data", async () => {
        mockedCheckByUsernameOrEmail.mockResolvedValueOnce(true);
        const data = "foo";

        await testExpressValidator(
          {
            usernameOrEmail: data,
          },
          validators.usernameOrEmail()
        );

        expect(mockedCheckByUsernameOrEmail).toHaveBeenCalledWith(data);
      });
    });
  });
});
