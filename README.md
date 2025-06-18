# Inventory Management Backend


This is the backend API for an Inventory Management System that purpose to fullfill the technical test from PT. Grha Digital Indonesia built with Node.js, Express, and Sequelize (with MySQL as the database). It provides RESTful endpoints for managing products and includes JWT-based authentication for secure access.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Postman Collection](https://winter-eclipse-668598.postman.co/workspace/Mekari~0d132b35-3289-460f-8fcc-1f0196eb3470/collection/25966629-b3fb6bf4-6b55-4a2c-9575-07cfb5efa320?action=share&creator=25966629)

## Features
- CRUD operations for products (Create, Read, Update, Delete).
- Filter products by price and quantity.
- Paginated product retrieval.
- Search products by name or description.
- User registration and login with JWT authentication.
- Protected routes for adding, updating, and deleting products.

## Tech Stack
- **Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: MySQL
- **Authentication**: JSON Web Token (JWT) with `jsonwebtoken` and `bcrypt`
- **Dependencies**: `axios`, `dotenv`

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/inventory-management.git
   cd inventory-management
