import { User } from "@models";

type Data = {
  username: string;
  email: string;
  password: string;
};

async function createUser(data: Data): Promise<User> {
  return User.create(data);
}

export default createUser;
