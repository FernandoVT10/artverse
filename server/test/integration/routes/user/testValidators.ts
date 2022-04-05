import { Request } from "supertest";

import User from "@routes/user/UserModel";

type MockData = {
  [key: string]: any;
};

type RequestAPI = () => Request;

const createUser = async (data?: { [key: string]: any }): Promise<User> => {
  return await User.create({
    username: "Beethoven",
    email: "beethoven@example.com",
    password: "secret",
    // rewrite the object with the specified parameters
    ...data,
  });
};

const assertErrors = async (
  requestAPI: RequestAPI,
  data: { [key: string]: any }
) => {
  const result = await requestAPI().send(data);

  const { errors } = result.body;
  expect(errors).toMatchSnapshot();
};

const generateTextWithLength = (length: number): string => {
  let text = "";

  while (length > 0) {
    text += "-";
    length--;
  }

  return text;
};

export const testUsernameValidation = (
  requestAPI: RequestAPI,
  mockData: MockData
) => {
  it.each([
    {
      username: false,
      testName: "the username is not a string",
    },
    {
      username: "abc",
      testName: "the username is shorter than 4 characters",
    },
    {
      username: generateTextWithLength(31),
      testName: "the username is larger than 30 characters",
    },
  ])("should return an error when $testName", async ({ username }) => {
    const data = {
      ...mockData,
      username,
    };

    await assertErrors(requestAPI, data);
  });

  it("should return an error when the username already exists in the database", async () => {
    const username = "alex";

    await createUser({ username });

    const data = {
      ...mockData,
      username,
    };

    await assertErrors(requestAPI, data);
  });
};

export const testEmailValidation = (
  requestAPI: RequestAPI,
  mockData: MockData
) => {
  it("should return an error when the email is invalid", async () => {
    const data = {
      ...mockData,
      email: "foo",
    };

    await assertErrors(requestAPI, data);
  });

  it("should return an error when the email already exists in the database", async () => {
    const email = "test@example.com";

    await createUser({ email });

    const data = {
      ...mockData,
      email,
    };

    await assertErrors(requestAPI, data);
  });
};

export const testPasswordValidation = (
  requestAPI: RequestAPI,
  mockData: MockData
) => {
  it("should return an error when the password is not a string", async () => {
    const data = {
      ...mockData,
      password: 1,
    };

    await assertErrors(requestAPI, data);
  });

  it("should return an error when the password is empty", async () => {
    const data = {
      ...mockData,
      password: "",
    };

    await assertErrors(requestAPI, data);
  });
};
