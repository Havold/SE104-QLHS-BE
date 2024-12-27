import express from "express";
import {
  addStudentsToDTScoreBoard,
  removeStudentFromDTScoreBoard,
} from "../controllers/detailScoreBoard.js";

const router = express.Router();

router.post("/", addStudentsToDTScoreBoard);
router.delete("/:id/students/:studentId", removeStudentFromDTScoreBoard);

export default router;
