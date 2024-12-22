import express from "express";
import dotenv from "dotenv";
import StudentRoutes from "./routes/students.js";
import TeacherRoutes from "./routes/teachers.js";
import SubjectRoutes from "./routes/subjects.js";
import ClassRoutes from "./routes/classes.js";
import GradeRoutes from "./routes/grades.js";
import DetailClassRoutes from "./routes/detailClasses.js";
import AuthRoutes from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// USE MIDDLEWARE
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);

  next();
});
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(cookieParser());

app.use("/api/auth", AuthRoutes);
app.use("/api/students", StudentRoutes);
app.use("/api/teachers", TeacherRoutes);
app.use("/api/subjects", SubjectRoutes);
app.use("/api/classes", ClassRoutes);
app.use("/api/grades", GradeRoutes);
app.use("/api/detail-classes", DetailClassRoutes);

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
