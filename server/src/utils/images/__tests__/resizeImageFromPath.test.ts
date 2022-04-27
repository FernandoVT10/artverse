import sharp from "sharp";
import resizeImageFromPath from "../resizeImageFromPath";
import LoggerHandler from "../../LoggerHandler";

import { ServerError } from "../../errors";

jest.mock("sharp");
jest.mock("../../LoggerHandler");

describe("utils/images/resizeImageFromPath", () => {
  const mockedSharp = jest.mocked(sharp);

  const mockedSharpMethods = {
    resize: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    mockedSharp.mockImplementationOnce(() => {
      return mockedSharpMethods as any;
    });
  });

  const imagePath = "/foo.jpg";

  it("should call sharp with the given image path", async () => {
    await resizeImageFromPath(imagePath, []);
    expect(mockedSharp).toHaveBeenCalledWith(imagePath);
  });

  const sizes = [
    {
      width: 100,
      height: 100,
      suffix: "foo",
    },
  ];

  it("should call the 'resize' method with the given size", async () => {
    await resizeImageFromPath(imagePath, sizes);

    const { width, height } = sizes[0];
    expect(mockedSharpMethods.resize).toHaveBeenCalledWith(width, height);
  });

  it("should call the 'toFile' method with the correct path", async () => {
    const imagePath = "/foo/123-bar.jpg";
    await resizeImageFromPath(imagePath, sizes);

    const { suffix } = sizes[0];
    expect(mockedSharpMethods.toFile).toHaveBeenCalledWith(
      `/foo/${suffix}-123-bar.webp`
    );
  });

  it("should return a object with the images paths and the suffix as key", async () => {
    const imagePath = "/foo/123-bar.jpg";

    const { suffix } = sizes[0];

    expect(await resizeImageFromPath(imagePath, sizes)).toEqual({
      [suffix]: `/foo/${suffix}-123-bar.webp`,
      original: imagePath,
    });
  });

  describe("when it throws", () => {
    beforeEach(() => {
      mockedSharp.mockReset();
    });

    it("should throw a ServerError", async () => {
      mockedSharp.mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(() => resizeImageFromPath("", [])).rejects.toThrow(
        new ServerError("There was an error trying to save some images.")
      );
    });

    it("should call the 'logError' method", async () => {
      const error = new Error("test");
      mockedSharp.mockImplementationOnce(() => {
        throw error;
      });

      try {
        await resizeImageFromPath("", []);
      } catch {
        const mockedLogError = jest.mocked(LoggerHandler.logError);
        expect(mockedLogError).toHaveBeenCalledWith(error);
      }
    });
  });
});
