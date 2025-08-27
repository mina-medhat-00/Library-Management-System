import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

/**
 * Represents a Book in the library management system.
 *
 * @model
 * @typedef {Object} Book
 * @property {string} title - The title of the book. (Required)
 * @property {string} author - The author of the book.
 * @property {string} isbn - The unique ISBN-13 identifier for the book. (Required)
 * @property {number} availableQuantity - The number of available copies of the book. (Required, defaults to 0)
 * @property {string} shelfLocation - The shelf location code for the book.
 *
 * @description
 * Sequelize model for the 'books' table, supporting soft deletes and timestamps.
 */
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
