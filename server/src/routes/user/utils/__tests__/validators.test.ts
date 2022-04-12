import {
  checkIfUsernameIsAvailable,
  checkIfEmailIsAvailable,
  checkIfUserExists,
} from "../validators";
import { checkIfAFieldExists } from "../../repositories";

jest.mock("../../repositories");

describe("routes/user/utils/validators", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkIfUsernameIsAvaiilable", () => {
    const mockedCheckUsername = jest.mocked(checkIfAFieldExists.checkUsername);

    it("shouldn't throw when 'checkUsername' returns false", async () => {
      mockedCheckUsername.mockResolvedValueOnce(false);
      await checkIfUsernameIsAvailable("");
    });

    it("should throw an error when 'checkUsername' returns true", async () => {
      mockedCheckUsername.mockResolvedValueOnce(true);

      await expect(() => checkIfUsernameIsAvailable("")).rejects.toThrow();
    });

    it("should throw call 'checkUsername' with the given username", async () => {
      mockedCheckUsername.mockResolvedValueOnce(false);
      const username = "test";

      await checkIfUsernameIsAvailable(username);

      expect(mockedCheckUsername).toHaveBeenCalledWith(username);
    });
  });

  describe("checkIfEmailIsAvaiilable", () => {
    const mockedCheckEmail = jest.mocked(checkIfAFieldExists.checkEmail);

    it("shouldn't throw when 'checkEmail' returns false", async () => {
      mockedCheckEmail.mockResolvedValueOnce(false);
      await checkIfEmailIsAvailable("");
    });

    it("should throw an error when 'checkEmail' returns true", async () => {
      mockedCheckEmail.mockResolvedValueOnce(true);

      await expect(() => checkIfEmailIsAvailable("")).rejects.toThrow();
    });

    it("should throw call 'checkEmail' with the given email", async () => {
      mockedCheckEmail.mockResolvedValueOnce(false);
      const email = "test";

      await checkIfEmailIsAvailable(email);

      expect(mockedCheckEmail).toHaveBeenCalledWith(email);
    });
  });

  describe("checkIfUserExists", () => {
    const mockedCheckUsernameAndEmail = jest.mocked(
      checkIfAFieldExists.checkUsernameAndEmail
    );

    it("shouldn't throw when 'checkUsernameAndEmail' returns true", async () => {
      mockedCheckUsernameAndEmail.mockResolvedValueOnce(true);

      const data = "foo";
      await checkIfUserExists(data);

      expect(mockedCheckUsernameAndEmail).toHaveBeenCalledWith(data);
    });

    it("should throw when 'checkUsernameAndEmail' returns false", async () => {
      mockedCheckUsernameAndEmail.mockResolvedValueOnce(false);

      await expect(() => checkIfUserExists("")).rejects.toThrowError(
        "The username or email don't exist"
      );
    });
  });
});
