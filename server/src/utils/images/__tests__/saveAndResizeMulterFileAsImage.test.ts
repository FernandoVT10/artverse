import sharp from "sharp";
import LoggerHandler from "../../LoggerHandler";

import { ServerError } from "@utils/errors";

import saveAndResizeMulterFileAsImage, {
  Size,
} from "../saveAndResizeMulterFileAsImage";

jest.mock("sharp");
jest.mock("../../LoggerHandler");

describe("utils/images/saveAndResizeMulterFileAsImage", () => {
  const multerFileMock = {
    originalname: "foo.png",
    buffer: Buffer.from([]),
  } as any;
  const toSavePathMock = "/root/bar/";

  const mockedSharp = jest.mocked(sharp);

  describe("when a function throws", () => {
    beforeEach(() => {
      mockedSharp.mockClear();
    });

    it("should throw an error", async () => {
      expect.assertions(1);

      try {
        mockedSharp.mockImplementationOnce(() => {
          throw new Error();
        });
        await saveAndResizeMulterFileAsImage(
          multerFileMock,
          toSavePathMock,
          []
        );
      } catch (err) {
        expect(err).toEqual(
          new ServerError(
            "There was an error trying to save images. Try it later."
          )
        );
      }
    });

    it("should call 'logError' with the throwed error", async () => {
      expect.assertions(1);

      const error = new Error("test error");

      try {
        mockedSharp.mockImplementationOnce(() => {
          throw error;
        });
        await saveAndResizeMulterFileAsImage(
          multerFileMock,
          toSavePathMock,
          []
        );
      } catch {
        const mockedLogError = jest.mocked(LoggerHandler.logError);
        expect(mockedLogError).toHaveBeenCalledWith(error);
      }
    });
  });

  describe("when everything goes ok", () => {
    const mockSharpChain = {
      resize: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockReturnThis(),
    };

    const sizes: Size[] = [
      {
        width: 100,
        height: 100,
        suffix: "square",
      },
    ];

    const setupMock = () => {
      jest.clearAllMocks();

      Date.now = () => 123;
      Math.random = () => 1;

      mockedSharp.mockReturnValue(mockSharpChain as any);

      return `123-${1e6}`;
    };

    describe("when there're sizes", () => {
      let expectedImagePath: string;

      beforeEach(() => {
        const imageName = setupMock();
        const { suffix } = sizes[0];

        expectedImagePath = `${toSavePathMock}${suffix}-${imageName}.webp`;
      });

      const callFunction = () =>
        saveAndResizeMulterFileAsImage(multerFileMock, toSavePathMock, sizes, {
          saveOriginal: false,
        });

      it("should call the 'resize' method with the given size", async () => {
        const { width, height } = sizes[0];

        await callFunction();

        expect(mockSharpChain.resize).toHaveBeenCalledWith(width, height);
        expect(mockSharpChain.resize).toHaveBeenCalledTimes(sizes.length);
      });

      it("should call the 'toFile'", async () => {
        await callFunction();

        expect(mockSharpChain.toFile).toHaveBeenCalledWith(expectedImagePath);
        expect(mockSharpChain.toFile).toHaveBeenCalledTimes(sizes.length);
      });

      it("should return a object with the paths using suffixes as keys", async () => {
        const { suffix } = sizes[0];

        expect(await callFunction()).toEqual({
          [suffix]: expectedImagePath,
        });
      });
    });

    describe("when the option 'saveOriginal' is true", () => {
      let expectedImagePath: string;

      beforeEach(() => {
        const imageName = setupMock();
        expectedImagePath = `${toSavePathMock}${imageName}.png`;
      });

      const callFunction = () =>
        saveAndResizeMulterFileAsImage(multerFileMock, toSavePathMock, []);

      it("should call the 'toFile'", async () => {
        await callFunction();

        expect(mockSharpChain.toFile).toHaveBeenCalledWith(expectedImagePath);
      });

      it("should return the path of the original image", async () => {
        expect(await callFunction()).toEqual({
          original: expectedImagePath,
        });
      });
    });
  });
});
