import { Op } from "sequelize";

import {
  checkByUsername,
  checkByEmail,
  checkByUsernameOrEmail,
} from "../checkIfUserExists";

import User from "../../UserModel";

jest.mock("../../UserModel");

describe("routes/user/repositories/checkIfUserExists", () => {
  const mockedCount = jest.mocked(User.count);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkByUsername", () => {
    it("should return true", async () => {
      mockedCount.mockResolvedValueOnce(1);
      expect(await checkByUsername("foo")).toBeTruthy();
    });

    it("should call the 'count' method", async () => {
      mockedCount.mockResolvedValueOnce(0);
      const username = "test";

      await checkByUsername(username);

      expect(mockedCount).toHaveBeenCalledWith({
        where: { username },
      });
    });
  });

  describe("checkByEmail", () => {
    it("should return true", async () => {
      mockedCount.mockResolvedValueOnce(1);
      expect(await checkByEmail("foo")).toBeTruthy();
    });

    it("should call the 'count' method", async () => {
      mockedCount.mockResolvedValueOnce(0);
      const email = "test";

      await checkByEmail(email);

      expect(mockedCount).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe("checkByUsernameOrEmail", () => {
    it("should return true", async () => {
      mockedCount.mockResolvedValueOnce(1);
      expect(await checkByUsernameOrEmail("foo")).toBeTruthy();
    });

    it("should call the 'count' method", async () => {
      const data = "foo";

      await checkByUsernameOrEmail("foo");

      expect(mockedCount).toHaveBeenCalledWith({
        where: {
          [Op.or]: {
            username: data,
            email: data,
          },
        },
      });
    });
  });
});
