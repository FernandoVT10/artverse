import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "@config/constants";
import { User } from "@models";

export const createUser = async (data?: Partial<User>): Promise<User> => {
  return await User.create({
    username: "Beethoven",
    email: "beethoven@example.com",
    password: "secret",
    // rewrite the object with the specified parameters
    ...data,
  });
};

export const generateJWT = async (): Promise<{ token: string; user: User }> => {
  const user = await createUser();
  const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY);

  return { token, user };
};
