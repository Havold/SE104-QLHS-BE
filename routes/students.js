import express from "express";
import {
  addStudent,
  getAllStudents,
  getStudent,
} from "../controllers/student.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getStudent);
router.post("/", addStudent);

export default router;
