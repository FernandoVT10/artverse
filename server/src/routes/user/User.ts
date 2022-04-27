import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Association,
  Sequelize,
} from "sequelize";

import { Illustration } from "../illustration/Illustration";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare avatar: string | null;
  declare password: string;
  declare description: string | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare static associations: {
    illustrations: Association<User, Illustration>;
  };
}

export default {
  init(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING(30),
          unique: true,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },
        avatar: DataTypes.STRING,
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: DataTypes.STRING(300),
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "users",
      }
    );

    return User;
  },

  associate(models: Sequelize["models"]) {
    User.hasMany(models.Illustration, {
      as: "illustrations",
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });
  },
};

// export default User;
