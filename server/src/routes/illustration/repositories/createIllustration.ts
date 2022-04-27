import { Illustration } from "../../../models";

type Data = {
  userId: number;
  title: string;
  description: string;
  images: {
    thumbnail: string;
    original: string;
  };
};

export default function createIllustration(data: Data): Promise<Illustration> {
  return Illustration.create(data, {
    include: Illustration.associations.images,
  });
}
