# 📘 Student Management System - Backend
## 📖 Overview
The Student Management System backend provides the core functionality for managing students, academic years, subjects, classes, grades, and exam results. Built with Node.js and Express, it uses PostgreSQL for data storage and Prisma ORM for database interactions, ensuring a seamless and efficient development experience.
## 🌟 Features
- **Role-based Authentication:**
  - **Admin**: Full access to manage all resources, including students, classes, subjects, and exam results.
  - **Student**: Restricted access to view only their own academic results.
- **Student Management**: CRUD operations for student records (create, retrieve, update, delete).
- **Class & Grade Management**: Manage classes, grades, and academic year assignments.
- **Subject Management**: Add, update, and delete subjects for each academic year.
- **Exam Results Management**:
  - Admin can input and update student scores.
  - Generate semester and subject-wise reports.
- **Reporting**: Export reports for student performance by semester or subject.
  
## 💻 Technologies Used
- **Node.js**: JavaScript runtime environment for building scalable server-side applications.
- **Express.js**: Web application framework for creating RESTful APIs.
- **PostgreSQL**: Relational database system for data storage.
- **Prisma**: ORM (Object Relational Mapping) for database interaction and schema management.
- **bcryptjs**: For hashing and comparing passwords securely.
- **cookie-parser**: To parse cookies in incoming requests.
- **cors**: To enable cross-origin resource sharing between the backend and frontend.
- **dotenv**: For environment variable management.
- **jsonwebtoken**: To handle authentication via JWT.
- **moment**: For date and time formatting.
- **multer**: Middleware for handling file uploads.
- **nodemon**: For automatic server restarts during development.

## 🛠️ System Requirements
- Node.js installed.
- PostgreSQL installed.
- Prisma CLI installed globally (npm install -g prisma).
- Git installed.
## 🚀 Getting Started
**1. Clone the Repository:**
   ```
   git clone https://github.com/Havold/SE104-QLHS-BE.git
   cd SE104-QLHS-BE
   ```
**2. Install Dependencies:**
   ```
   npm install
   ```
**3. Set Up the Environment Variables:**
   Create a `.env` file in the root directory and configure it as follows:
   ```
    PORT = 8080

    DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>"
    JWT_SECRET = your_jwt_secret_key
    
    DESTINATION_DIR = "uploads/"
   ```
**4. Set Up the Database:** 
- Initialize Prisma
  ```
  npx prisma init
  ```
- Run the migrations to create database tables:
  ```
  npx prisma migrate dev
  ```

**5. Start the Server:**
   ```
   npm start
   ```
**6. Test the APIs:**
   The server will run at http://localhost:8080. You can use tools like Postman to test the APIs.

## API Endpoints: Below I will list some typical endpoints.
### Authentication
| Method   | Endpoints                     | Description                  |
|----------|-------------------------------|------------------------------|
| POST     | `/api/auth/register`          | Register a new user          |
| POST     | `/api/auth/login`             | Login for students or admin  |
| POST     | `/api/auth/logout`            | Logout                       |

### Student Management
| Method   | Endpoints                     | Description                  |
|----------|-------------------------------|------------------------------|
| GET      | `/api/students`                  | Get a list of all students        |
| POST     | `/api/students`                  | Add a new student           |
| DELETE   | `/api/students/:id`              | Remove a student             |
| PUT   | `/api/students/:id`              | Update student details            |

### Class Management
| Method   | Endpoints                     | Description                  |
|----------|-------------------------------|------------------------------|
| GET      | `/api/classes`                  | Get all classes            |
| POST     | `/api/classes`                  | Add a new class        |
| DELETE   | `/api/classes/:id`                  | Remove a class  |
| PUT   | `/api/classes/:id`                  | Update class details  |

### Subject Management
| Method   | Endpoints                     | Description                       |
|----------|-------------------------------|-----------------------------------|
| GET      | `/api/subjects`               | Get a list of all subjects      |
| POST     | `/api/subjects`       | 	Add a new subject  |
| DELETE   | `/api/subjects/:id`                  | Remove a subject  |
| PUT   | `/api/subjects/:id`                  | Update subject details  |



