import { Op } from "sequelize";
import getUserByEmailOrUsername from "../getUserByEmailOrUsername";

import User from "../../UserModel";

jest.mock("../../UserModel");

describe("routes/user/repositories/getUserByEmailOrUsername", () => {
  const mockedUserFindOne = jest.mocked(User.findOne);

  beforeEach(() => {
    mockedUserFindOne.mockClear();
  });

  const data = "foo";

  it("should call the 'findOne' method with the given data", async () => {
    await getUserByEmailOrUsername(data);

    expect(mockedUserFindOne).toHaveBeenCalledWith({
      where: {
        [Op.or]: {
          username: data,
          email: data,
        },
      },
    });
  });

  it("should return the user", async () => {
    const user = "user";
    mockedUserFindOne.mockResolvedValueOnce(user as any);

    expect(await getUserByEmailOrUsername(data)).toBe(user);
  });
});
