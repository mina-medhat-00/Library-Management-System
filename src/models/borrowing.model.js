import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Book from "./book.model.js";
import Borrower from "./borrower.model.js";

/**
 * Borrowing process is the junction table for borrowers and books
 */
const Borrowing = sequelize.define(
  "Borrowing",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM("borrowed", "returned", "overdue"),
      allowNull: false,
      defaultValue: "borrowed",
    },
  },
  {
    tableName: "borrowings",
    timestamps: true,
  }
);

Borrower.hasMany(Borrowing, { foreignKey: "borrowerId" });
Book.hasMany(Borrowing, { foreignKey: "bookId" });

Borrowing.belongsTo(Borrower, { foreignKey: "borrowerId" });
Borrowing.belongsTo(Book, { foreignKey: "bookId" });

export default Borrowing;
