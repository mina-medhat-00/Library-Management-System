import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

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
    availableQuantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    shelfLocation: {
      type: DataTypes.STRING(5),
    },
  },
  {
    tableName: "books",
    paranoid: true,
    timestamps: true,
    indexes: [{ unique: true, fields: ["isbn"] }],
  }
);

export default Book;
