"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Borrowings", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      borrowerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Borrowers", key: "id" },
        onDelete: "CASCADE",
      },
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Books", key: "id" },
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM("borrowed", "returned", "overdue"),
        defaultValue: "borrowed",
      },
      borrowDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      returnDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Borrowings");
  },
};
