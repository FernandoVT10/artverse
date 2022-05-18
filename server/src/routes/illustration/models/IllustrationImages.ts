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

import { Illustration } from "./Illustration";

// this type has the values that are neccesary to create the IllustrationImages model
export type IllustrationImagesType = {
  thumbnail: string;
  original: string;
};

export class IllustrationImages extends Model<
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

export default {
  init(sequelize: Sequelize) {
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
        timestamps: false,
        tableName: "illustrations_images",
      }
    );

    return Illustration;
  },

  associate(models: Sequelize["models"]) {
    IllustrationImages.belongsTo(models.Illustration, {
      as: "illustration",
    });
  },
};
