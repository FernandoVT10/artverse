import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import supertest from "supertest";
import app from "@app";

import { testPasswordField } from "./shared";
import { clearDB } from "@test-utils/setupDB";
import { createUser } from "@test-utils/factories/userFactory";
import { JWT_SECRET_KEY } from "@config/constants";
import { User } from "@models";

describe("Integration POST /api/users/login", () => {
  let user: User;

  const usernameOrEmail = "foo-bar";
  const plainPassword = "secret";

  beforeEach(async () => {
    await clearDB();

    const hashedPassword = await bcrypt.hash(plainPassword, 1);
    user = await createUser({
      username: usernameOrEmail,
      password: hashedPassword,
    });
  });

  const request = supertest(app);
  const requestAPI = () => request.post("/api/users/login");

  const getTokenFromCookies = (cookies: string[]): string => {
    const cookie = cookies[0];
    const token = cookie.split(";")[0];
    const parsedToken = token.replace("token=", "");
    return parsedToken;
  };

  it("should set cookie with a valid jsonwebtoken and return a success message", async () => {
    const res = await requestAPI()
      .send({
        usernameOrEmail: user.username,
        password: plainPassword,
      })
      .expect(200);

    expect(res.body.success).toBeTruthy();

    const token = getTokenFromCookies(res.get("Set-Cookie"));

    expect(() => jwt.verify(token, JWT_SECRET_KEY)).not.toThrow();
  });

  it("should return an error when the password is incorrect", async () => {
    const res = await requestAPI()
      .send({
        usernameOrEmail: user.username,
        password: "123",
      })
      .expect(400);

    const { errors } = res.body;
    expect(errors).toMatchSnapshot();
  });

  describe("validation", () => {
    describe("usernameOrEmail field", () => {
      it("should return an error when the username or email don't exist", async () => {
        const res = await requestAPI().send({
          usernameOrEmail: "foo",
          password: "test",
        });

        const { errors } = res.body;

        expect(errors).toMatchSnapshot();
      });
    });

    testPasswordField(requestAPI, {
      // here i'm passing an username that already exists to not have
      // an error with the usernameOrEmail field
      usernameOrEmail,
    });
  });
});
