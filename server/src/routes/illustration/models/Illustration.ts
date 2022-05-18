import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  Sequelize,
  NonAttribute,
} from "sequelize";

import { IllustrationImages } from "./IllustrationImages";

import { User } from "@models";
import { Like } from "./Like";

export class Illustration extends Model<
  InferAttributes<Illustration>,
  InferCreationAttributes<Illustration>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare title: string;
  declare description: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare images?: NonAttribute<IllustrationImages>;

  declare static associations: {
    images: Association<Illustration, IllustrationImages>;
    user: Association<Illustration, User>;
    likes: Association<Illustration, Like>;
  };
}

export default {
  init(sequelize: Sequelize) {
    Illustration.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        description: DataTypes.STRING(500),
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "illustrations",
      }
    );
  },

  associate(models: Sequelize["models"]) {
    Illustration.belongsTo(models.User, {
      as: "user",
    });

    Illustration.hasOne(models.IllustrationImages, {
      as: "images",
      foreignKey: {
        name: "illustrationId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });

    Illustration.hasMany(models.Like, {
      as: "likes",
      foreignKey: {
        name: "illustrationId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  },
};
