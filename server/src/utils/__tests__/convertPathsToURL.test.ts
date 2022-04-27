import convertPathsToURL from "../convertPathsToURL";

const PUBLIC_DIR = "/foo/public/";

jest.mock("@config/constants", () => ({
  PUBLIC_DIR: "/foo/public/",
}));

describe("utils/convertPathsToURL", () => {
  const reqMock = {
    protocol: "https",
    get() {
      return "example.com";
    },
  } as any;

  it("should return an object with the convertedPaths", () => {
    const pathsObject = {
      foo: `${PUBLIC_DIR}bar.webp`,
    };

    const convertedPaths = convertPathsToURL(pathsObject, reqMock);

    expect(convertedPaths).toEqual({
      foo: "https://example.com/bar.webp",
    });
  });
});
