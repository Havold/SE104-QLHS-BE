import express from "express";
import {
  addStudentsToDTScoreBoard,
  getDetailScoreBoard,
  removeStudentFromDTScoreBoard,
} from "../controllers/detailScoreBoard.js";

const router = express.Router();

router.get("/:id", getDetailScoreBoard);
router.post("/", addStudentsToDTScoreBoard);
router.delete("/:id/students/:studentId", removeStudentFromDTScoreBoard);

export default router;
