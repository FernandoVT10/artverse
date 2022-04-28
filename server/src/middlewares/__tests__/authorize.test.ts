import mockExpress, { ExpressMocked } from "@test-utils/mockExpress";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

import authorize from "../authorize";

import { User } from "@models";
import { JWT_SECRET_KEY } from "@config/constants";
import { ServerError } from "@utils/errors";

jest.mock("jsonwebtoken");
jest.mock("@models");

describe("middlewares/authorize", () => {
  const userId = 1;
  const token = "foo";

  const mockedJWTVerify = jest.mocked(jwt.verify);
  const mockedUserCount = jest.mocked(User.count);

  const setupMock = () => {
    const expressMocked = mockExpress();

    mockedJWTVerify.mockReturnValueOnce({
      userId,
    } as any);

    mockedUserCount.mockResolvedValueOnce(1);

    Object.assign(expressMocked.req, {
      cookies: { token },
    });

    return expressMocked;
  };

  it("should call 'next' when a function throws and 'isRequired' is false", async () => {
    const middleware = authorize(false);

    const { req, res, next } = mockExpress();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.anything());
  });

  describe("should call 'next' with an error when 'isRequired' is true and", () => {
    const middleware = authorize(true);

    const assertError = async (
      expressMocked: ExpressMocked,
      error: ServerError
    ) => {
      const { req, res, next } = expressMocked;

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    };

    it("when the 'jwt.verify' function throws", async () => {
      const expressMocked = setupMock();

      mockedJWTVerify.mockReset();
      mockedJWTVerify.mockImplementation(() => {
        throw new JsonWebTokenError("");
      });

      const error = new ServerError("The credentials are invalid");
      await assertError(expressMocked, error);
    });

    it("when the 'count' function rejects", async () => {
      const expressMocked = setupMock();

      mockedUserCount.mockReset();
      mockedUserCount.mockRejectedValueOnce(new Error());

      const error = new ServerError();
      await assertError(expressMocked, error);
    });

    it("when checkById returns 0", async () => {
      const expressMocked = setupMock();

      mockedUserCount.mockReset();
      mockedUserCount.mockResolvedValue(0);

      const error = new ServerError();
      await assertError(expressMocked, error);
    });

    it("when the 'token' cookie doesn't exists", async () => {
      const expressMocked = setupMock();

      Object.assign(expressMocked.req, {
        cookies: {},
      });

      const error = new ServerError("You don't have enough permissions");
      await assertError(expressMocked, error);
    });
  });

  describe("when the jsonwebtoken is valid", () => {
    const { req, res, next } = setupMock();

    beforeAll(async () => {
      const middleware = authorize();
      await middleware(req, res, next);
    });

    it("should call the 'verify' function", () => {
      expect(mockedJWTVerify).toHaveBeenCalledWith(token, JWT_SECRET_KEY);
    });

    it("sould call the 'count' function", async () => {
      expect(mockedUserCount).toHaveBeenCalledWith({
        where: {
          id: userId,
        },
      });
    });

    it("should call the 'next' function", () => {
      expect(next).toHaveBeenCalled();
    });

    it("should set the userId into the 'req' object", async () => {
      expect(req.userId).toBe(userId);
    });
  });
});
