# Pharmacy API
A RESTful API built with **NestJS** and **Prisma** to manage pharmacy orders. This API allows users to place, view, and update the status of medication orders.

---

## Table of Contents
1. [Installation](#installation)
2. [DB Models](#db-models)
3. [API Endpoints](#api-endpoints)
4. [Contributing](#contributing)
5. [License](#license)

---

## Installation

### 1. Requirements
- **Node.js** >= 14
- **PostgreSQL**
- **Prisma**
- **NestJS**
- **Redis**

### 2. How to Run the App
1. Run `npm install` to install all dependencies.
2. Create the `.env` file for the database connection.
3. Run `npm run migrate:dev` to migrate the models to the database.
4. run `npm run prisma:dev:deploy` to deploy the models to db
5. Run `npm run start:dev` to start the application.
6. Run `npm run start:db` to start the database.

### How To Run The Testing
1. Create the `.env.test` file for the database connection.
2. Run `npm run migrate:test` to migrate the models to the database.
3. run `npm run prisma:test:deploy` to deploy the models to db
4. Run `npm run test:e2e` to start the application.
5. Run `npm run start:db:test` to start the database.

---

## DB Models
The database consists of the following models:
1. **User Model**
2. **User Roles Model**
3. **Medicines Model**
4. **Orders Model**
5. **Notifications Model**

---

## API Endpoints
The API provides the following endpoints:

### 1. GET Requests
1. **Medicines**: Accessible by `customer`, `admin`, and `pharmacy` roles.
2. **users/me**: Accessible by all roles.
3. **Customers**: Accessible by `customer support` and `admin` roles.
4. **Orders**: Accessible by `customer support` and `customers` roles.
5. **All Users with All Roles**: Accessible only by the `admin` role.

### 2. POST Requests
1. **Orders**: Accessible by `customer`, `admin`, and `customer support` roles.
2. **Medicines**: Accessible by `customer`, `admin`, and `pharmacy` roles.
3. **Users**: Accessible by `customer` for login or registration, and managed by `admin` and `customer support` roles.
4. **Roles**: Accessible only by the `admin` role.

### 3. PATCH Requests
1. **Orders**: Accessible by `customer`, `admin`, and `customer support` roles.
2. **Medicines**: Accessible by `customer`, `admin`, and `pharmacy` roles.
3. **Users**: Accessible by `customer` for login or registration, and managed by `admin` and `customer support` roles.
4. **Roles**: Accessible only by the `admin` role.

### 4. DELETE Requests
1. **Orders**: Accessible by `customer`, `admin`, and `customer support` roles.
2. **Medicines**: Accessible by `customer`, `admin`, and `pharmacy` roles.
3. **Users**: Accessible by `customer` for login or registration, and managed by `admin` and `customer support` roles.
4. **Roles**: Accessible only by the `admin` role.

For more details, visit the [API Design Document](https://www.figma.com/board/UmyIPejBj5Y6XvhUTCROfW/Pharmacy-System-Organiser?node-id=0-1&t=wUDRjDRliQgqarYB-1).

---

## Contributing
### 1. Getting Started
1. Fork the repository by clicking the **Fork** button at the top of this page.
2. Clone the forked repository to your local machine:
   `git clone https://github.com/your-username/pharmacy-api.git`
3. Navigate to the project directory:
`cd pharmacy-api`
4. Install dependencies:
`npm install`
5. Run the application locally:
`npm run start:dev`
### 2. How to Contribute
1. Reporting Issues:
    Search existing issues before creating a new one.
2. For bugs:
    1. provide steps to reproduce the issue, expected behavior, and actual behavior.
    2. Label the issue appropriately (e.g., bug, enhancement, question).
3. Proposing Features
    1. Open a new issue with the enhancement label.
    2. Provide details about the feature and its use case.
 4. Submitting Code:
    1. Create a new branch:
    `git checkout -b feature/your-feature`
    2. Make your changes and commit them:
    `git commit -m "Add your commit message here"`
    3. Push to the branch:
    `git push origin feature/your-feature`
    4. Open a pull request.
---    
   
# License
This project, Pharmacy API, is developed and planned by Omar Wael and is protected under copyright.

You are free to use, modify, and share the code, but proper attribution must be given to the original author. Redistribution of this project in any form must include the following information:

**Developer: Omar Wael** 

**Portfolio Link: [Omar Wael's Portfolio](https://omar-wael.netlify.app/)**

Unauthorized use of this work without proper credit is prohibited.
For further inquiries or permission requests, please contact me via the details provided in the portfolio link above.
