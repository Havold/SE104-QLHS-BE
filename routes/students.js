import express from "express";
import {
  addStudent,
  getAllStudents,
  getStudent,
  updateStudent,
} from "../controllers/student.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getStudent);
router.post("/", addStudent);
router.put("/:id", updateStudent);

export default router;
