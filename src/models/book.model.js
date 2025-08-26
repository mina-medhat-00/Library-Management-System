import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

const Book = sequelize.define(
  "Book",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
    },
    isbn: {
      type: DataTypes.STRING(13),
      allowNull: false,
      unique: true,
    },
    available_quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    shelf_location: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "books",
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["isbn"] }],
  }
);

export default Book;
