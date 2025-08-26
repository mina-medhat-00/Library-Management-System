import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";

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
