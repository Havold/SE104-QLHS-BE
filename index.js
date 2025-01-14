import express from "express";
import dotenv from "dotenv";
import StudentRoutes from "./routes/students.js";
import TeacherRoutes from "./routes/teachers.js";
import SubjectRoutes from "./routes/subjects.js";
import ClassRoutes from "./routes/classes.js";
import GradeRoutes from "./routes/grades.js";
import DetailClassRoutes from "./routes/detailClasses.js";
import SchoolYearRoutes from "./routes/schoolYears.js";
import StudentsClassRoutes from "./routes/studentsClass.js";
import ScoreBoardRoutes from "./routes/scoreBoards.js";
import DetailScoreBoardRoutes from "./routes/detailScoreBoards.js";
import SemesterRoutes from "./routes/semesters.js";
import TypesOfExamRoutes from "./routes/typesOfExam.js";
import SubjectReportsRoutes from "./routes/subjectReports.js";
import SemesterReportsRoutes from "./routes/semesterReports.js";
import RulesRoutes from "./routes/rules.js";
import AuthRoutes from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

dotenv.config();
const app = express();

// USE MIDDLEWARE
app.use(express.json());
app.use("/uploads", express.static("uploads"));
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.DESTINATION_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", AuthRoutes);
app.use("/api/students", StudentRoutes);
app.use("/api/teachers", TeacherRoutes);
app.use("/api/subjects", SubjectRoutes);
app.use("/api/classes", ClassRoutes);
app.use("/api/grades", GradeRoutes);
app.use("/api/detail-classes", DetailClassRoutes);
app.use("/api/school-years", SchoolYearRoutes);
app.use("/api/students-class", StudentsClassRoutes);
app.use("/api/score-boards", ScoreBoardRoutes);
app.use("/api/detail-score-boards", DetailScoreBoardRoutes);
app.use("/api/semesters", SemesterRoutes);
app.use("/api/types-of-exam", TypesOfExamRoutes);
app.use("/api/subject-reports", SubjectReportsRoutes);
app.use("/api/semester-reports", SemesterReportsRoutes);
app.use("/api/rules", RulesRoutes);

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
