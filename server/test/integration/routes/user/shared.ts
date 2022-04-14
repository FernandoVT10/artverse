import type { Request } from "supertest";

import { createUser } from "@test-utils/factories/userFactory";

import generateRandomText from "@test-utils/generateRandomText";

const assertErrors = async (requestAPI: RequestAPI, data: object) => {
  const result = await requestAPI().send(data);

  expect(result.statusCode).toBe(400);

  const { errors } = result.body;
  expect(errors).toMatchSnapshot();
};

type RequestAPI = () => Request;

export const testUsernameField = (requestAPI: RequestAPI, mockData: object) => {
  describe("username field", () => {
    it("should return an error when the username is not a string", async () => {
      await assertErrors(requestAPI, {
        ...mockData,
        username: false,
      });
    });

    it("should return an error when the username is shorter than 4 characters", async () => {
      await assertErrors(requestAPI, {
        ...mockData,
        username: "abc",
      });
    });

    it("should return an error when the username is larger than 30 characters", async () => {
      await assertErrors(requestAPI, {
        ...mockData,
        username: generateRandomText(31),
      });
    });

    it("should return an error when the username already exists in the database", async () => {
      const username = "alex";

      await createUser({ username });

      await assertErrors(requestAPI, {
        ...mockData,
        username,
      });
    });
  });
};

export const testEmailField = (requestAPI: RequestAPI, mockData: object) => {
  describe("email field", () => {
    it("should return an error when the email is invalid", async () => {
      await assertErrors(requestAPI, {
        ...mockData,
        email: "foo",
      });
    });

    it("should return an error when the email already exists in the database", async () => {
      const email = "test@example.com";

      await createUser({ email });

      await assertErrors(requestAPI, {
        ...mockData,
        email,
      });
    });
  });
};

export const testPasswordField = (requestAPI: RequestAPI, mockData: object) => {
  describe("password field", () => {
    it("should return an error when the password is not a string", async () => {
      await assertErrors(requestAPI, {
        ...mockData,
        password: 1,
      });
    });

    it("should return an error when the password is empty", async () => {
      await assertErrors(requestAPI, {
        ...mockData,
        password: "",
      });
    });
  });
};
