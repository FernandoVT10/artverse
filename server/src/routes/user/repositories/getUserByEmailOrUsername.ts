import { Op } from "sequelize";
import User from "../UserModel";

function getUserByEmailOrUsername(data: string): Promise<User | null> {
  return User.findOne({
    where: {
      [Op.or]: {
        username: data,
        email: data,
      },
    },
  });
}

export default getUserByEmailOrUsername;
