import express from "express";
import {
  createSemesterReport,
  deleteSemesterReport,
  getAllSemesterReports,
} from "../controllers/semesterReport.js";

const router = new express.Router();

router.get("/", getAllSemesterReports);
router.post("/", createSemesterReport);
router.delete("/:id", deleteSemesterReport);

export default router;
