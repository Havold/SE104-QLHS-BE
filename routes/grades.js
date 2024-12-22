import express from "express";
import {
  addGrade,
  deleteGrade,
  getAllGrades,
  updateGrade,
} from "../controllers/grade.js";

const router = express.Router();

router.get("/", getAllGrades);
router.post("/", addGrade);
router.put("/:id", updateGrade);
router.delete("/:id", deleteGrade);

export default router;
