import jwt from "jsonwebtoken";

import { assertServerError } from "@test-utils/assertions";
import { JWT_SECRET_KEY } from "@config/constants";
import { Request } from "supertest";

export default (requestApi: () => Request) => {
  describe("should return an error when", () => {
    it("you don't create a cookie with the token", async () => {
      const response = await requestApi();
      assertServerError(response);
    });

    it("the token is invalid", async () => {
      const response = await requestApi().set("Cookie", "token=abc");
      assertServerError(response);
    });

    it("the userId of the token doesn't exist", async () => {
      const token = jwt.sign(
        {
          userId: 1234,
        },
        JWT_SECRET_KEY
      );

      const response = await requestApi().set("Cookie", `token=${token}`);

      assertServerError(response);
    });
  });
};
