import multer, { diskStorage } from "multer";

import createMulterInstance, {
  imageFilter,
  filename,
} from "../createMulterInstance";

import { ServerError } from "@utils/errors";

jest.mock("multer");

describe("utils/createMulterInstance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a multer instance", () => {
    const mockedDiskStorage = jest.mocked(diskStorage);
    const storageStub = "foo" as any;
    mockedDiskStorage.mockReturnValueOnce(storageStub);

    const destination = "/foo/bar";
    createMulterInstance(destination);

    expect(mockedDiskStorage).toHaveBeenCalledWith({
      destination,
      filename,
    });

    const mockedMulter = jest.mocked(multer);
    expect(mockedMulter).toHaveBeenCalledWith({
      storage: storageStub,
      limits: expect.any(Object),
      fileFilter: imageFilter,
    });
  });

  const req = null as any;
  const callback = jest.fn();

  describe("imageFilter", () => {
    it("should call the callback with true when the file mimetype starts with 'image/'", () => {
      const file = { mimetype: "image/png" } as any;

      imageFilter(req, file, callback);

      expect(callback).toHaveBeenCalledWith(null, true);
    });

    it("should call the callback with an error when the file mimetype doesn't start with 'image/'", () => {
      const file = { mimetype: "foo/bar" } as any;

      imageFilter(req, file, callback);

      expect(callback).toHaveBeenCalledWith(
        new ServerError("All files must be images")
      );
    });
  });

  describe("filename", () => {
    it("should call the callback", () => {
      Date.now = () => 123;
      Math.random = () => 0;

      const file = { originalname: "foo.gif" } as any;
      filename(req, file, callback);

      expect(callback).toHaveBeenCalledWith(null, "123-0.gif");
    });
  });
});
