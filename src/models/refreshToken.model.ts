// src/models/refreshToken.model.ts

import { Model, DataTypes } from "sequelize";
import sequelize from "@config/db.config"; // Adjust the import path to your sequelize config

class RefreshToken extends Model {
  public id!: number;
  public token!: string;
  public userId!: number;
  public expires!: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RefreshToken",
    tableName: "refresh_tokens",
  }
);

export { RefreshToken };
