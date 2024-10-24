import express from "express";
import dotenv from "dotenv";
import StudentRoutes from "./routes/students.js";
import TeacherRoutes from "./routes/teachers.js";
import cors from "cors";

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

app.use("/api/students", StudentRoutes);
app.use("/api/teachers", TeacherRoutes);

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
