import {
  checkIfUsernameIsAvailable,
  checkIfEmailIsAvailable,
  checkIfUsernameOrEmailExists,
} from "../validators";
import { checkIfUserExists } from "../../repositories";

jest.mock("../../repositories");

describe("routes/user/utils/validators", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkIfUsernameIsAvaiilable", () => {
    const mockedCheckByUsername = jest.mocked(
      checkIfUserExists.checkByUsername
    );

    it("should throw an error when 'checkByUsername' returns true", async () => {
      mockedCheckByUsername.mockResolvedValueOnce(true);

      await expect(() => checkIfUsernameIsAvailable("")).rejects.toThrow();
    });

    it("should call 'checkByUsername' with the given username", async () => {
      mockedCheckByUsername.mockResolvedValueOnce(false);
      const username = "test";

      await checkIfUsernameIsAvailable(username);

      expect(mockedCheckByUsername).toHaveBeenCalledWith(username);
    });
  });

  describe("checkIfEmailIsAvaiilable", () => {
    const mockedCheckByEmail = jest.mocked(checkIfUserExists.checkByEmail);

    it("should throw an error when 'checkByEmail' returns true", async () => {
      mockedCheckByEmail.mockResolvedValueOnce(true);

      await expect(() => checkIfEmailIsAvailable("")).rejects.toThrow();
    });

    it("should call 'checkByEmail' with the given email", async () => {
      mockedCheckByEmail.mockResolvedValueOnce(false);
      const email = "test";

      await checkIfEmailIsAvailable(email);

      expect(mockedCheckByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe("checkIfUsernameOrEmailExists", () => {
    const mockedCheckByUsernameOrEmail = jest.mocked(
      checkIfUserExists.checkByUsernameOrEmail
    );

    it("should throw when 'checkByUsernameOrEmail' returns false", async () => {
      mockedCheckByUsernameOrEmail.mockResolvedValueOnce(false);

      await expect(() => checkIfUsernameOrEmailExists("")).rejects.toThrowError(
        "The username or email don't exist"
      );
    });

    it("should call 'checkByUsernameOrEmail' with the given data", async () => {
      mockedCheckByUsernameOrEmail.mockResolvedValueOnce(true);
      const data = "foo";

      await checkIfUsernameOrEmailExists(data);

      expect(mockedCheckByUsernameOrEmail).toHaveBeenCalledWith(data);
    });
  });
});
