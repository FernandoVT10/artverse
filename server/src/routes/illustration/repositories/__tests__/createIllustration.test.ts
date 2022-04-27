import createIllustration from "../createIllustration";

import { Illustration } from "@models";

jest.mock("@models");

describe("routes/illustration/repositories/createIllustration", () => {
  const mockedIllustrationCreate = jest.mocked(Illustration.create);

  beforeEach(() => {
    mockedIllustrationCreate.mockClear();
  });

  const data = {
    userId: 1,
    title: "foo",
    description: "bar",
    images: {
      thumbnail: "thumbnail.webp",
      original: "original.webp",
    },
  };

  it("should call the 'create' method", async () => {
    await createIllustration(data);

    expect(mockedIllustrationCreate).toHaveBeenCalledWith(data, {
      include: Illustration.associations.images,
    });
  });

  it("should return the created illustration", async () => {
    const createdIllustration = "foo";
    mockedIllustrationCreate.mockResolvedValueOnce(createdIllustration);

    expect(await createIllustration(data)).toBe(createdIllustration);
  });
});
