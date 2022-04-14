import bcrypt from "bcrypt";

import { validate, controller } from "../login";
import { ValidationError } from "@utils/errors";

import getUserByEmailOrUsername from "../../repositories/getUserByEmailOrUsername";
import mockExpress from "@test-utils/mockExpress";
import generateJWT from "../../utils/generateJWT";

jest.mock("bcrypt");
jest.mock("../../repositories/getUserByEmailOrUsername");
jest.mock("../../utils/generateJWT");

describe("routes/user/controllers/login", () => {
  describe("controller", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const BODY_DATA = {
      usernameOrEmail: "foo",
      password: "secret",
    };

    const callController = async (data = BODY_DATA) => {
      const mockedExpress = mockExpress({
        bodyData: data,
      });

      const { req, res, next } = mockedExpress;
      await controller(req, res, next);

      return mockedExpress;
    };

    const mockGetUserByEmailOrUsername = (password = "secret", id = 1) => {
      const mockedGetUserByEmailOrUsername = jest.mocked(
        getUserByEmailOrUsername
      );

      mockedGetUserByEmailOrUsername.mockResolvedValueOnce({
        id,
        password,
      } as any);
    };

    const mockBcryptCompare = () => {
      const mockedBcryptCompare = jest.mocked(bcrypt.compare);

      mockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(true));
    };

    const mockGenerateJWT = (token = "token") => {
      const mockedGenerateJWT = jest.mocked(generateJWT);

      mockedGenerateJWT.mockReturnValueOnce(token);
    };

    it("should call 'res.json' with the token", async () => {
      mockGetUserByEmailOrUsername();
      mockBcryptCompare();

      const token = "foo";
      mockGenerateJWT(token);

      const { res } = await callController();

      expect(res.json).toHaveBeenCalledWith(token);
    });

    describe("getUserByEmailOrUsername", () => {
      const mockedGetUserByEmailOrUsername = jest.mocked(
        getUserByEmailOrUsername
      );

      it("should call 'getUserByEmailOrUsername'", async () => {
        const data = {
          ...BODY_DATA,
          usernameOrEmail: "foo",
        };

        await callController(data);

        expect(mockedGetUserByEmailOrUsername).toHaveBeenCalledWith(
          data.usernameOrEmail
        );
      });
    });

    describe("bcrypt.compare", () => {
      const mockedBcryptCompare = jest.mocked(bcrypt.compare);

      it("should call 'bcrypt.compare'", async () => {
        const userPassword = "foo";
        mockGetUserByEmailOrUsername(userPassword);

        const data = {
          ...BODY_DATA,
          password: "secret",
        };

        await callController(data);

        expect(mockedBcryptCompare).toHaveBeenCalledWith(
          data.password,
          userPassword
        );
      });

      it("should call 'next' when 'bcrypt.compare' returns false", async () => {
        mockGetUserByEmailOrUsername();
        mockedBcryptCompare.mockImplementationOnce(() =>
          Promise.resolve(false)
        );

        const { next } = await callController();

        expect(next).toHaveBeenCalledWith(
          new ValidationError("The password is incorrect", "password")
        );
      });
    });

    describe("generateJWT", () => {
      const mockedGenerateJWT = jest.mocked(generateJWT);

      it("should call 'generateJWT' with the correct payload", async () => {
        const userId = 1;

        mockGetUserByEmailOrUsername("secret", userId);
        mockBcryptCompare();

        await callController();

        expect(mockedGenerateJWT).toHaveBeenCalledWith({
          userId,
        });
      });
    });
  });

  describe("validate", () => {
    it("should return an array with the validation middlewares", () => {
      expect(validate()).toHaveLength(3);
    });
  });
});
