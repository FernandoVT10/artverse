import { Op } from "sequelize";

import {
  checkField,
  checkUsername,
  checkEmail,
  checkUsernameAndEmail,
} from "../checkIfAFieldExists";

import User from "../../UserModel";

jest.mock("../../UserModel");

describe("routes/user/repositories/checkIfAFieldExists", () => {
  const mockedCount = jest.mocked(User.count);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkField", () => {
    it("should return false if the 'count' method returns 0", async () => {
      mockedCount.mockResolvedValueOnce(0);
      expect(await checkField("username", "")).toBeFalsy();
    });

    it("should return true if the 'count' method returns 1 or more", async () => {
      mockedCount.mockResolvedValueOnce(1);
      expect(await checkField("username", "")).toBeTruthy();
    });
  });

  describe("checkUsername", () => {
    it("should call the 'count' method with the field equals to 'username' and the given value", async () => {
      mockedCount.mockResolvedValueOnce(0);
      const username = "test";

      await checkUsername(username);

      expect(mockedCount).toHaveBeenCalledWith({
        where: { username },
      });
    });
  });

  describe("checkEmail", () => {
    it("should call the 'count' method with the field equals to 'email' and the given value", async () => {
      mockedCount.mockResolvedValueOnce(0);
      const email = "test";

      await checkEmail(email);

      expect(mockedCount).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe("checkUsernameAndEmail", () => {
    it("should return false if the 'count' method returns 0", async () => {
      mockedCount.mockResolvedValueOnce(0);
      expect(await checkUsernameAndEmail("foo")).toBeFalsy();
    });

    it("should return true if the 'count' method returns 1 or more", async () => {
      mockedCount.mockResolvedValueOnce(1);
      expect(await checkUsernameAndEmail("foo")).toBeTruthy();
    });

    it("should call the 'count' method", async () => {
      const data = "foo";

      await checkUsernameAndEmail("foo");

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
