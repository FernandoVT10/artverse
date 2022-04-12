import { Op, WhereOptions } from "sequelize";

import User from "../UserModel";

async function checkUser(whereOptions: WhereOptions<User>): Promise<boolean> {
  const count = await User.count({
    where: whereOptions,
  });

  return count > 0;
}

export function checkByUsername(username: string): Promise<boolean> {
  return checkUser({ username });
}

export function checkByEmail(email: string): Promise<boolean> {
  return checkUser({ email });
}

export async function checkByUsernameOrEmail(data: string): Promise<boolean> {
  return checkUser({
    [Op.or]: {
      username: data,
      email: data,
    },
  });
}
