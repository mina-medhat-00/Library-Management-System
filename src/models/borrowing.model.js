import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Book from "./book.model.js";
import Borrower from "./borrower.model.js";

/**
 * Represents the Borrowing model, which acts as a junction table between Borrower and Book models.
 * Tracks the borrowing process, including borrow date, due date, return date, and status.
 *
 * @model Borrowing
 * @typedef {Object} Borrowing
 * @property {number} id - Unique identifier for the borrowing record.
 * @property {Date} borrowDate - The date when the book was borrowed.
 * @property {Date} dueDate - The date by which the book should be returned.
 * @property {Date} [returnDate] - The date when the book was actually returned.
 * @property {"borrowed"|"returned"|"overdue"} status - The current status of the borrowing process.
 * @property {number} borrowerId - Foreign key referencing the Borrower.
 * @property {number} bookId - Foreign key referencing the Book.
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
