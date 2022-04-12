import { Op } from "sequelize";

import User from "../UserModel";

type Field = "username" | "email";

export async function checkField(
  field: Field,
  value: string
): Promise<boolean> {
  const count = await User.count({
    where: { [field]: value },
  });

  return count > 0;
}

export function checkUsername(username: string): Promise<boolean> {
  return checkField("username", username);
}

export function checkEmail(email: string): Promise<boolean> {
  return checkField("email", email);
}

export async function checkUsernameAndEmail(data: string): Promise<boolean> {
  const count = await User.count({
    where: {
      [Op.or]: {
        username: data,
        email: data,
      },
    },
  });

  return count > 0;
}
