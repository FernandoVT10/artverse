import { testValidator } from "@test-utils/expressValidatorHelpers";
import generateRandomText from "@test-utils/generateRandomText";

import * as validators from "../validators";

describe("routes/illustration/utils/validators", () => {
  describe("title", () => {
    const testTitle = (title: any, error: string) =>
      testValidator({ title }, validators.title(), error);

    it("should return an error if it's not a string", async () => {
      await testTitle(1, "The title must be a string");
    });

    it("should return an error if it's emtpy", async () => {
      await testTitle("", "The title is required");
    });

    it("should return an error if it has more than 100 characters", async () => {
      const title = generateRandomText(101);
      await testTitle(title, "The title must have 100 or less characters");
    });
  });

  describe("description", () => {
    const testDescription = (description: any, error: string) =>
      testValidator({ description }, validators.description(), error);

    it("should return an error if it's not a string", async () => {
      await testDescription(1, "The description must be a string");
    });

    it("should return an error if it has more than 500 characters", async () => {
      const description = generateRandomText(501);
      await testDescription(
        description,
        "The description must have 500 or less characters"
      );
    });

    it("should return an error if it's empty", async () => {
      await testDescription("", "The description is required");
    });
  });
});
