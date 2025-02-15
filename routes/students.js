import express from "express";
import {
  addStudent,
  countSexStudents,
  deleteStudent,
  getAllStudents,
  getStudent,
  updateStudent,
} from "../controllers/student.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/utils/count-sex-of-students", countSexStudents);
router.get("/:id", getStudent);
router.post("/", addStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
