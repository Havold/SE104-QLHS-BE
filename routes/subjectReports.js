import express from "express";
import {
  createSubjectReport,
  deleteSubjectReport,
  getAllSubjectReports,
} from "../controllers/subjectReport.js";

const router = new express.Router();

router.get("/", getAllSubjectReports);
router.post("/", createSubjectReport);
router.delete("/:id", deleteSubjectReport);

export default router;
