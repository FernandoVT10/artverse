import { ValidationError } from "@utils/errors";
import { resizeImageFromPath } from "@utils/images";
import { createIllustration } from "../../repositories";
import { controller } from "../createIllustration";

import convertPathsToURL from "@utils/convertPathsToURL";
import mockExpress from "@test-utils/mockExpress";

jest.mock("../../repositories");
jest.mock("@utils/images");
jest.mock("@utils/convertPathsToURL");

describe("routes/illustration/controllers/createIllustration", () => {
  const mockedResizeImageFromPath = jest.mocked(resizeImageFromPath);
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

  beforeEach(() => {
    jest.clearAllMocks();

    mockedResizeImageFromPath.mockResolvedValueOnce(
      resizeImageFromPathResponse
    );

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

    await controller(req, res, next);

    return { req, res };
  };

  it("should call resizeImageFromPath", async () => {
    const { req } = await callController();

    expect(mockedResizeImageFromPath).toHaveBeenCalledWith(req.file.path, [
      {
        width: 250,
        height: 250,
        suffix: "thumbnail",
      },
    ]);
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
      userId: 1,
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
