# Library Management System API

A **RESTful API** for managing books, borrowers, and borrowings in a library.
Built with **Node.js, Express, Sequelize ORM, and Swagger** for API documentation.

---

## Features

- Manage **Books** (CRUD, soft delete, search by title/author/ISBN)
- Manage **Borrowers** (CRUD)
- Manage **Borrowings** (borrow, return, overdue tracking)
- Export borrowings report as **CSV**
- Search functionality for books
- Input validation with **Joi**
- API Documentation with **Swagger UI**
- Database migrations & seeders with Sequelize

---

## Tech Stack

- **Backend**: Node.js v22.11, Express v4.21
- **Database**: Sequelize ORM, Sequelize CLI
- **Validation**: Joi
- **Docs**: Swagger UI
- **Other**: CSV Writer, Nodemon (dev)

---

## Project Structure

```
src/
│── controllers/     # Route logic
│── models/          # Sequelize models
│── routes/          # Express routes
│── middlewares/     # Error handling & validation
│── utils/           # Helpers (AppError, etc.)
│── config/          # Configurations for database and swagger
|── validators/      # Validation files using Joi validator
|── seeders/         # Seeder files for dummy data
│── server.js        # App entry point
```

---

## Getting Started

### Clone the repo

```bash
git clone https://github.com/mina-medhat-00/Library-Management-System.git
cd Library-Management-System
```

### Install dependencies

```bash
npm install
```

### Setup environment variables

Create a `.env` file in the project root:

### Setup the database

Run Sequelize migrations:

```bash
npx sequelize-cli db:migrate
```

(Optional) Seed initial data:

```bash
npx sequelize-cli db:seed:all
```

### Start the server

- Development:

```bash
npm run dev
```

- Production:

```bash
npm start
```

Server should run on `http://localhost:3000`

---

## Available Scripts

| Script               | Description                            |
| -------------------- | -------------------------------------- |
| `npm start`          | Start server in production mode        |
| `npm run dev`        | Start server with Nodemon (hot reload) |
| `npm run db:migrate` | Run database table creation migrations |
| `npm run db:seed`    | Seed database with sample data         |
| `npm run db:undo`    | Remove sample data                     |
| `npm run db:reset`   | Undo changes in sample data            |

---

## API Documentation

Swagger UI available at:
`http://localhost:5000/api-docs`

---

## Example Endpoints

### Books

- `GET /api/v1/books` → Get all books
- `GET /api/v1/books/:id` → Get single book
- `POST /api/v1/books` → Create book
- `PUT /api/v1/books/:id` → Update book
- `DELETE /api/v1/books/:id` → Soft delete book
- `GET /api/v1/books/search?query=harry` → Search by title/author/ISBN

### Borrowers

- `GET /api/v1/borrowers` → Get all borrowers
- `POST /api/v1/borrowers` → Create borrower

### Borrowings

- `POST /api/v1/borrowings/borrow` → Borrow book
- `POST /api/v1/borrowings/return` → Return book
- `GET /api/v1/borrowings/overdue` → Get overdue books
- `GET /api/v1/borrowings/:id/books` → Get borrower’s borrowed books
- `GET /api/v1/borrowings/report?start=2025-08-01&end=2025-08-27` → Export report (CSV)

---

## Testing

Test endpoints using:

- Swagger UI (`http://localhost:3000/api-docs`)
- Postman

---
