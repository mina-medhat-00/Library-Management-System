const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface) {
    const books = [];
    const borrowers = [];

    for (let i = 0; i < 20; i++) {
      books.push({
        title: faker.lorem.words(3),
        author: faker.person.fullName(),
        isbn: faker.commerce.isbn({ variant: 13, separator: "" }),
        availableQuantity: faker.number.int({ max: 100 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      borrowers.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("Books", books, {});
    await queryInterface.bulkInsert("Borrowers", borrowers, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Books", null, {});
    await queryInterface.bulkDelete("Borrowers", null, {});
  },
};
