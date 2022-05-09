import imageFilter from "../imageFilter";

import { ServerError } from "../../errors";

describe("utils/multer/imageFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const req = null as any;
  const callback = jest.fn();

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
