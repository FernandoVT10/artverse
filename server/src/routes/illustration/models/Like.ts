import { User } from "@models";
import { Illustration } from "./Illustration";

import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Like extends Model<
  InferAttributes<Like>,
  InferCreationAttributes<Like>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare illustrationId: ForeignKey<Illustration["id"]>;

  declare static associations: {
    user: Association<Like, User>;
    illustration: Association<Like, Illustration>;
  };
}

export default {
  init(sequelize: Sequelize) {
    Like.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
      },
      {
        sequelize,
        tableName: "likes",
      }
    );
  },
  associate(models: Sequelize["models"]) {
    Like.belongsTo(models.User, {
      as: "user",
    });

    Like.belongsTo(models.Illustration, {
      as: "illustration",
    });
  },
};
