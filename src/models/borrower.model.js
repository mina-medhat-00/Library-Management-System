import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

/**
 * Sequelize model representing a Borrower in the library management system.
 *
 * @model Borrower
 * @typedef {Object} Borrower
 * @property {string} name - The name of the borrower. Required.
 * @property {string} email - The email address of the borrower. Must be unique and valid.
 *
 * @description
 * This model stores information about borrowers, including their name and unique email address.
 * It uses paranoid deletion and timestamps, and enforces uniqueness on the email field.
 */
const Borrower = sequelize.define(
  "Borrower",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: "borrowers",
    paranoid: true,
    timestamps: true,
    indexes: [{ unique: true, fields: ["email"] }],
  }
);

export default Borrower;
