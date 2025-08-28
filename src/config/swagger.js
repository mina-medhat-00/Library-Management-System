import swaggerJsdoc from "swagger-jsdoc";

/**
 * Swagger configuration options for the Library Management API.
 *
 * This configuration object sets up the OpenAPI documentation,
 * including endpoint definitions, reusable schemas, and server information. It is used by swagger-jsdoc
 * to generate the Swagger specification for API documentation and UI.
 *
 * visit /api-docs for API documentation
 */
const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Library Management API",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT ?? 3000}/api/v1`,
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        Book: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Clean Code" },
            author: { type: "string", example: "Robert C. Martin" },
            isbn: { type: "string", example: "9780132350884" },
            availableQuantity: { type: "integer", example: 10 },
            shelfLocation: { type: "string", example: "A-12" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Borrower: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Alice Johnson" },
            email: { type: "string", example: "alice@example.com" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Borrowing: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            borrowerId: { type: "integer", example: 2 },
            bookId: { type: "integer", example: 3 },
            status: { type: "string", example: "borrowed" },
            borrowDate: { type: "string", format: "date-time" },
            dueDate: { type: "string", format: "date-time" },
            returnedAt: { type: "string", format: "date-time", nullable: true },
          },
        },
      },
    },
    paths: {
      "/books": {
        get: {
          summary: "Get all books (paginated)",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
          ],
          responses: {
            200: {
              description: "List of books",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Book" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new book",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Book" },
              },
            },
          },
          responses: {
            201: { description: "Book created" },
          },
        },
      },
      "/books/{id}": {
        get: {
          summary: "Get a book by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Book retrieved",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Book" },
                },
              },
            },
            404: { description: "Book not found" },
          },
        },
        put: {
          summary: "Update a book by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Book" },
              },
            },
          },
          responses: {
            200: { description: "Book updated" },
          },
        },
        delete: {
          summary: "Delete a book by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Book deleted" },
          },
        },
      },
      "/books/search": {
        get: {
          summary: "Search books by title, author, or ISBN",
          parameters: [
            { name: "title", in: "query", schema: { type: "string" } },
            { name: "author", in: "query", schema: { type: "string" } },
            { name: "isbn", in: "query", schema: { type: "string" } },
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
          ],
          responses: {
            200: {
              description: "Search results",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Book" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/borrowers": {
        get: {
          summary: "Get all borrowers (paginated)",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
          ],
          responses: {
            200: {
              description: "List of borrowers",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Borrower" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new borrower",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Borrower" },
              },
            },
          },
          responses: {
            201: { description: "Borrower created" },
          },
        },
      },
      "/borrowers/{id}": {
        get: {
          summary: "Get borrower by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Borrower retrieved",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Borrower" },
                },
              },
            },
          },
        },
        put: {
          summary: "Update borrower by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Borrower" },
              },
            },
          },
          responses: {
            200: { description: "Borrower updated" },
          },
        },
        delete: {
          summary: "Delete borrower by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Borrower deleted" },
          },
        },
      },
      "/borrowers/{id}/books": {
        get: {
          summary: "Get books borrowed by a borrower",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Borrowed books retrieved" },
          },
        },
      },
      "/borrowings/overdue": {
        get: {
          summary: "Get overdue books",
          responses: {
            200: {
              description: "Overdue borrowings",
            },
          },
        },
      },
      "/borrowings/report": {
        get: {
          summary: "Export borrowings report as CSV",
          parameters: [
            {
              name: "start",
              in: "query",
              required: true,
              schema: { type: "string", format: "date" },
            },
            {
              name: "end",
              in: "query",
              required: true,
              schema: { type: "string", format: "date" },
            },
          ],
          responses: {
            200: { description: "CSV report generated" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
