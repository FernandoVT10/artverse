import bcrypt from "bcrypt";
import supertest from "supertest";
import app from "@app";

import { User } from "@models";
import { clearDB } from "@test-utils/setupDB";

import { testUsernameField, testEmailField, testPasswordField } from "./shared";

describe("Integration POST /api/users/register", () => {
  beforeEach(async () => {
    await clearDB();
  });

  const requestData = {
    username: "alex",
    email: "alex@example.com",
    password: "secret",
  };

  const request = supertest(app);
  const requestAPI = () => request.post("/api/users/register/");

  const requestAPIAndGetUser = async (requestData: any): Promise<User> => {
    await requestAPI().send(requestData);

    return (await User.findOne({
      where: { username: requestData.username },
    })) as User;
  };

  it("should return a successful response", async () => {
    const result = await requestAPI().send(requestData).expect(200);

    const { body } = result;
    expect(body.success).toBeTruthy();
  });

  it("should create the user in the database", async () => {
    const user = await requestAPIAndGetUser(requestData);

    expect(user).toMatchObject({
      username: requestData.username,
      email: requestData.email,
    });
  });

  it("should hash the user password", async () => {
    const user = await requestAPIAndGetUser(requestData);

    const hashedPassword = user.password as string;

    expect(
      await bcrypt.compare(requestData.password, hashedPassword)
    ).toBeTruthy();
  });

  describe("validation", () => {
    testUsernameField(requestAPI, requestData);
    testEmailField(requestAPI, requestData);
    testPasswordField(requestAPI, requestData);
  });
});
