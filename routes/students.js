import express from "express";
import {
  addStudent,
  deleteStudent,
  getAllStudents,
  getStudent,
  updateStudent,
} from "../controllers/student.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getStudent);
router.post("/", addStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
