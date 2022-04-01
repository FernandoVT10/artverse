import createUser from "../createUser";

import User from "../../UserModel";

jest.mock("../../UserModel");

describe("routes/user/repositories/createUser", () => {
  const mockedUserCreate = jest.mocked(User.create);

  beforeEach(() => {
    mockedUserCreate.mockClear();
  });

  const data = {
    username: "test",
    email: "test@example.com",
    password: "secret",
  };

  it("should call the 'create' method with the given data", async () => {
    await createUser(data);

    expect(mockedUserCreate).toHaveBeenCalledWith(data);
  });

  it("should return the created user", async () => {
    const createdUser = "created user" as any;
    mockedUserCreate.mockResolvedValueOnce(createdUser);

    expect(await createUser(data)).toEqual(createdUser);
  });
});
