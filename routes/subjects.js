import express from "express";
import {
  addSubject,
  deleteSubject,
  getAllSubjects,
  getSubject,
  updateSubject,
} from "../controllers/subject.js";

const router = express.Router();

router.get("/", getAllSubjects);
router.get("/:id", getSubject);
router.delete("/:id", deleteSubject);
router.post("/", addSubject);
router.put("/:id", updateSubject);

export default router;
