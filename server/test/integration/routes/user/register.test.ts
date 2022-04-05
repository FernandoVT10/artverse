import "@test-utils/setupDB";

import supertest from "supertest";
import app from "@app";
import User from "@routes/user/UserModel";

import {
  testUsernameValidation,
  testEmailValidation,
  testPasswordValidation,
} from "./testValidators";

const request = supertest(app);

describe("Integration routes/user/register", () => {
  beforeEach(async () => {
    await User.sync({ force: true });
  });

  const data = {
    username: "alex",
    email: "alex@example.com",
    password: "secret",
  };

  const requestAPI = () => request.post("/api/users/register/");

  it("should return a successful response", async () => {
    const result = await requestAPI().send(data).expect(200);

    const { body } = result;
    expect(body.success).toBeTruthy();
  });

  it("should create the user in the database", async () => {
    await requestAPI().send(data);

    const user = await User.findOne({
      where: { username: data.username },
    });

    expect(user).toMatchObject({
      ...data,
      password: expect.any(String),
    });
  });

  describe("validation", () => {
    describe("username", () => {
      testUsernameValidation(requestAPI, {
        email: "test@example.com",
        password: "secret",
      });
    });

    describe("email", () => {
      testEmailValidation(requestAPI, {
        username: "test",
        email: "test@example.com",
        password: "secret",
      });
    });

    describe("password", () => {
      testPasswordValidation(requestAPI, {
        username: "test",
        email: "test@example.com",
        password: "secret",
      });
    });
  });
});
