import User from "../UserModel";

type Data = {
  username: string;
  email: string;
  password: string;
};

async function createUser(data: Data): Promise<User> {
  return User.create(data);
}

export default createUser;
