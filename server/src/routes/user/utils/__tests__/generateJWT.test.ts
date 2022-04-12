import jwt from "jsonwebtoken";
import generateJWT from "../generateJWT";

import { JWT_SECRET_KEY } from "@config/constants";

jest.mock("jsonwebtoken");

describe("routes/user/utils/generateJWT", () => {
  const mockedJWTSign = jest.mocked(jwt.sign);

  it("should call 'jwt.sign'", () => {
    const payload = "foo";

    generateJWT(payload);

    expect(mockedJWTSign).toHaveBeenCalledWith(payload, JWT_SECRET_KEY, {
      expiresIn: "30d",
    });
  });

  it("should return what 'jwt.sing' returns", () => {
    const returnedValue = "bar";
    mockedJWTSign.mockImplementation(() => returnedValue);

    expect(generateJWT("")).toBe(returnedValue);
  });
});
