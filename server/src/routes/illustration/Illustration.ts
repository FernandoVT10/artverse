import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  Sequelize,
} from "sequelize";

import { User } from "@routes/user/User";

// this type has the values that are neccesary to create the IllustrationImages model
export type IllustrationImagesType = {
  thumbnail: string;
  original: string;
};

class IllustrationImages extends Model<
  InferAttributes<IllustrationImages>,
  InferCreationAttributes<IllustrationImages>
> {
  declare id: CreationOptional<number>;
  declare illustrationId: ForeignKey<Illustration["id"]>;
  declare thumbnail: string;
  declare original: string;

  declare static associations: {
    illustration: Association<IllustrationImages, Illustration>;
  };
}

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

  declare static associations: {
    images: Association<Illustration, IllustrationImages>;
    user: Association<Illustration, User>;
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

    IllustrationImages.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        thumbnail: DataTypes.STRING,
        original: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "illustrations_images",
      }
    );

    return Illustration;
  },

  associate(models: Sequelize["models"]) {
    Illustration.belongsTo(models.User, {
      as: "user",
    });

    Illustration.hasOne(IllustrationImages, {
      as: "images",
      foreignKey: {
        name: "illustrationId",
        allowNull: false,
      },
      onDelete: "CASCADE",
    });

    IllustrationImages.belongsTo(Illustration, {
      as: "illustration",
    });
  },
};

// export default Illustration;
