# Book Management System

## Overview

The **Book Management System** is a RESTful API built with **NestJS** and **Mongoose (MongoDB)**, designed to manage books and authors efficiently. It provides CRUD operations for books and authors, supports validation, and ensures data integrity with relationships between books and authors.

This project is ideal for applications that require library management, book cataloging, or educational platforms.

---

## Features

- **CRUD Operations** for Books and Authors  
- **Author-Book Relationship**: Each book references an author via `authorId`  
- **Validation** using `class-validator` and `class-transformer`  
- **Unique ISBN** for each book  
- **Optional Fields**: Published date, genre  
- **Automatic Timestamps**: `createdAt` and `updatedAt` managed by Mongoose  
- **Swagger Documentation** for API endpoints  
- **Type-safe mapping** between DTOs, domain entities, and persistence models  

---

## Tech Stack

- **Backend Framework:** NestJS  
- **Database:** MongoDB (Mongoose ODM)  
- **Language:** TypeScript  
- **Validation:** class-validator, class-transformer  
- **API Docs:** Swagger  
- **Dependency Injection:** NestJS DI container  

---
## Using the Application with Docker

This project can be run entirely using Docker and Docker Compose. Follow these steps:

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

---

### 1. Clone the repository & Run using docker

```bash
git clone https://github.com/fuadashraful/book-management-api.git

cd book-management

sudo docker compose up --build
```

## Installation

1. Clone the repository & Run Locally (Please make sure mongodb is available or running using docker):

```bash
git clone https://github.com/fuadashraful/book-management-api.git

cd book-management
cp .env.example .env # After copy update env variables where necessary

npm install

npm start
```
## Running Tests

### Unit Tests
```bash
npm run test:unit
```
### E2E Tests
```bash
npm run test:e2e
```

## API Documentation (Swagger)

This project includes interactive API documentation powered by **Swagger (OpenAPI)**.

After starting the application, you can explore and test all available API endpoints directly from your browser.

### Accessing Swagger

Once the server is running, open your browser and go to:
n.b: swagger is enabled in development environment
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)
