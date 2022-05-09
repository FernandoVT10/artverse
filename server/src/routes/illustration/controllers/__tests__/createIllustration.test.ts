import { ValidationError } from "@utils/errors";
import { saveAndResizeMulterFileAsImage } from "@utils/images";
import { createIllustration } from "../../repositories";
import { controller } from "../createIllustration";

import convertPathsToURL from "@utils/convertPathsToURL";
import mockExpress from "@test-utils/mockExpress";
import {
  ILLUSTRATIONS_DESTINATION,
  ILLUSTRATIONS_SIZES,
} from "@routes/illustration/constants";

jest.mock("../../repositories");
jest.mock("@utils/images");
jest.mock("@utils/convertPathsToURL");

describe("routes/illustration/controllers/createIllustration", () => {
  const mockedSaveAndResizeMFAI = jest.mocked(saveAndResizeMulterFileAsImage);
  const mockedConvertPathsToURL = jest.mocked(convertPathsToURL);
  const mockedCreateIllustration = jest.mocked(createIllustration);

  const resizeImageFromPathResponse = {
    original: "/foo/bar.webp",
    thumbnail: "/foo/thumbnail-bar.webp",
  };

  const convertPathsToURLResponse = {
    original: "https://example.com/bar.webp",
    thumbnail: "https://example.com/thumbnail-bar.webp",
  };

  const createdIllustration = "test" as any;
  const userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedSaveAndResizeMFAI.mockResolvedValueOnce(resizeImageFromPathResponse);

    mockedConvertPathsToURL.mockReturnValueOnce(convertPathsToURLResponse);

    mockedCreateIllustration.mockResolvedValueOnce(createdIllustration);
  });

  const callController = async (bodyData?: any) => {
    const { req, res, next } = mockExpress({
      bodyData,
    });

    req.file = {
      path: "/foo/bar.webp",
    };

    req.userId = userId;

    await controller(req, res, next);

    return { req, res };
  };

  it("should call saveAndResizeMulterFileAsImage", async () => {
    const { req } = await callController();

    expect(mockedSaveAndResizeMFAI).toHaveBeenCalledWith(
      req.file,
      ILLUSTRATIONS_DESTINATION,
      ILLUSTRATIONS_SIZES
    );
  });

  it("should call convertPathsToURL with the imagesPaths", async () => {
    const { req } = await callController();

    expect(mockedConvertPathsToURL).toHaveBeenCalledWith(
      resizeImageFromPathResponse,
      req
    );
  });

  it("should call createIllustration", async () => {
    const title = "foo";
    const description = "bar";

    await callController({
      title,
      description,
    });

    expect(mockedCreateIllustration).toHaveBeenCalledWith({
      userId,
      title,
      description,
      images: convertPathsToURLResponse,
    });
  });

  it("should call res.json with the createdIllustration", async () => {
    const { res } = await callController();

    expect(res.json).toHaveBeenCalledWith(createdIllustration);
  });

  it("should call next when there's no a file", async () => {
    const { req, res, next } = mockExpress();

    await controller(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new ValidationError("The image is required", "image")
    );
  });
});
