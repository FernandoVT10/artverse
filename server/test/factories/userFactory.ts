import User from "@routes/user/UserModel";

export const createUser = async (data?: Partial<User>): Promise<User> => {
  return await User.create({
    username: "Beethoven",
    email: "beethoven@example.com",
    password: "secret",
    // rewrite the object with the specified parameters
    ...data,
  });
};
