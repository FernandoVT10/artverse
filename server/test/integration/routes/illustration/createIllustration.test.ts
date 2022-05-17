import fs from "fs";
import sharp from "sharp";
import path from "path";
import app from "@app";
import createAuthorizationTests from "../shared/createAuthorizationTests";

import supertest, { Response } from "supertest";

import { ILLUSTRATIONS_DESTINATION } from "@routes/illustration/constants";
import { generateJWT } from "@test-utils/factories/userFactory";
import { Illustration } from "@models";
import { clearDB } from "@test-utils/setupDB";

import {
  createDescriptionValidationTests,
  createImageValidationTests,
  createTitleValidationTests,
} from "./createValidationTests";

describe("Integration POST /api/illustrations/", () => {
  const request = supertest(app);
  const requestApi = () => request.post("/api/illustrations");

  const testImagePath = path.resolve(__dirname, "../../../fixtures/image.png");

  const illustrationMock = {
    title: "bar",
    description: "foo",
  };

  describe("authorization", () => {
    createAuthorizationTests(requestApi);
  });

  describe("validation", () => {
    let token: string;

    beforeAll(async () => {
      await clearDB();
      const result = await generateJWT();
      token = result.token;
    });

    describe("title", () => {
      const localRequestApi = () =>
        requestApi()
          .field("description", illustrationMock.description)
          .attach("image", testImagePath)
          .set("Cookie", `token=${token}`);

      createTitleValidationTests(localRequestApi);
    });

    describe("description", () => {
      const localRequestApi = () =>
        requestApi()
          .field("title", illustrationMock.title)
          .attach("image", testImagePath)
          .set("Cookie", `token=${token}`);

      createDescriptionValidationTests(localRequestApi);
    });

    describe("image", () => {
      const localRequestApi = () =>
        requestApi().field(illustrationMock).set("Cookie", `token=${token}`);

      createImageValidationTests(localRequestApi);
    });
  });

  describe("when the request is a success", () => {
    let response: Response;
    let userId: number;

    beforeAll(async () => {
      await clearDB();

      const { token, user } = await generateJWT();
      userId = user.id;

      response = await requestApi()
        .field(illustrationMock)
        .set("Cookie", `token=${token}`)
        .attach("image", testImagePath);
    });

    afterAll(async () => {
      const { original, thumbnail } = response.body.images;

      const originalName = path.basename(original);
      const thumbnailName = path.basename(thumbnail);

      // cleanup the uploaded images
      // TODO we need to change it for a better tested function in the future
      await Promise.all([
        fs.promises.rm(path.resolve(ILLUSTRATIONS_DESTINATION, originalName)),
        fs.promises.rm(path.resolve(ILLUSTRATIONS_DESTINATION, thumbnailName)),
      ]);
    });

    const expectedIllustration = {
      title: illustrationMock.title,
      description: illustrationMock.description,
      images: {
        original: expect.any(String),
        thumbnail: expect.any(String),
      },
    };

    it("should return a successfully response", async () => {
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        ...expectedIllustration,
        userId,
      });
    });

    it("should save the illustration on the database", async () => {
      const illustration = await Illustration.findOne({
        include: Illustration.associations.images,
      });

      expect(illustration).toMatchObject({
        ...expectedIllustration,
        userId,
      });
    });

    const getMetadataFromURL = (url: string) => {
      const basename = path.basename(url);
      const fullPath = path.resolve(ILLUSTRATIONS_DESTINATION, basename);

      return sharp(fullPath).metadata();
    };

    it("should save the original image", async () => {
      const originalImageMetadata = await sharp(testImagePath).metadata();
      const uploadedImageMetadata = await getMetadataFromURL(
        response.body.images.original
      );

      expect(originalImageMetadata).toEqual(uploadedImageMetadata);
    });

    it("should save a thumbnail", async () => {
      expect(
        await getMetadataFromURL(response.body.images.thumbnail)
      ).toMatchObject({
        width: 250,
        height: 250,
        format: "webp",
      });
    });
  });
});
