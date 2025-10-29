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

## Database Schema

**Book**

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| title | string | Title of the book |
| isbn | string | Unique ISBN number |
| publishedDate | Date | Optional publication date |
| genre | string | Optional genre |
| authorId | string | Reference to the author |
| createdAt | Date | Auto-generated timestamp |
| updatedAt | Date | Auto-generated timestamp |

**Author**

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| firstName | string | Author first name |
| lastName | string | Author last name |
| createdAt | Date | Auto-generated timestamp |
| updatedAt | Date | Auto-generated timestamp |

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/book-management.git
cd book-management
npm install
