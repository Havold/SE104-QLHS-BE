import express from "express";
import { getAllStudents, getStudent } from "../controllers/student.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getStudent);

export default router;
