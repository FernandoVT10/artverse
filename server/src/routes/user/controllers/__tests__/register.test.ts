import { createUser } from "../../repositories";
import { controller, validate } from "../register";

import hashPassword from "../../utils/hashPassword";
import mockExpress from "@test-utils/mockExpress";

jest.mock("../../repositories");
jest.mock("../../utils/hashPassword");

describe("routes/user/controllers/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("controller", () => {
    const mockedCreateUser = jest.mocked(createUser);
    const mockedHashPassword = jest.mocked(hashPassword);

    const userData = {
      username: "test",
      email: "password",
      password: "secret",
    };

    const mockHashPassword = () => {
      mockedHashPassword.mockImplementationOnce((password) =>
        Promise.resolve(password)
      );
    };

    it("should call 'createUser' with the correct data", async () => {
      const { req, res, next } = mockExpress({ bodyData: userData });
      mockHashPassword();

      await controller(req, res, next);

      expect(mockedCreateUser).toHaveBeenCalledWith(userData);
    });

    it("should call 'hashPassword' with the plain password", async () => {
      const { req, res, next } = mockExpress({ bodyData: userData });
      mockHashPassword();

      await controller(req, res, next);

      expect(mockedHashPassword).toHaveBeenCalledWith(userData.password);
    });

    it("should call 'res.json' with 'success: true' when everything goes ok", async () => {
      mockedCreateUser.mockResolvedValueOnce(null as any);
      mockHashPassword();

      const { req, res, next } = mockExpress({ bodyData: userData });
      await controller(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("should call the 'next' function when the 'createUser' function throws an error", async () => {
      const error = new Error();
      mockedCreateUser.mockRejectedValueOnce(error);
      mockHashPassword();

      const { req, res, next } = mockExpress({ bodyData: userData });
      await controller(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("validate", () => {
    it("should return an array with the validation middlewares", () => {
      expect(validate()).toHaveLength(4);
    });
  });
});
