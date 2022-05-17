import path from "path";

import { assertValidationError } from "@test-utils/assertions";
import { Request } from "supertest";

import generateRandomText from "@test-utils/generateRandomText";

type RequestAPI = () => Request;

export const createTitleValidationTests = (requestApi: RequestAPI) => {
  describe("should return an error when the title", () => {
    it("is not provided", async () => {
      const response = await requestApi();
      assertValidationError(response);
    });

    it("is not a string", async () => {
      const response = await requestApi()
        .field("title", "abc")
        .field("title", "xyz");
      assertValidationError(response);
    });

    it("has more than 100 characters", async () => {
      const response = await requestApi().field(
        "title",
        generateRandomText(101)
      );
      assertValidationError(response);
    });
  });
};

export const createDescriptionValidationTests = (requestApi: RequestAPI) => {
  describe("should return an error when the description", () => {
    it("is not provided", async () => {
      const response = await requestApi();
      assertValidationError(response);
    });

    it("is not a string", async () => {
      const response = await requestApi()
        .field("description", "abc")
        .field("description", "xyz");
      assertValidationError(response);
    });

    it("has more than 500 characters", async () => {
      const response = await requestApi().field(
        "description",
        generateRandomText(501)
      );
      assertValidationError(response);
    });
  });
};

export const createImageValidationTests = (requestApi: RequestAPI) => {
  describe("should return an error when", () => {
    it("the image is not attached", async () => {
      const response = await requestApi();

      assertValidationError(response);
    });

    it("you attach a file that's not an image", async () => {
      const filePath = path.resolve(__dirname, "../../../fixtures/test.txt");

      const response = await requestApi().attach("image", filePath);

      assertValidationError(response);
    });
  });
};
