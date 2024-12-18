import express from "express";
import {
  addSubject,
  getAllSubjects,
  getSubject,
} from "../controllers/subject.js";

const router = express.Router();

router.get("/", getAllSubjects);
router.get("/:id", getSubject);
router.post("/", addSubject);

export default router;
