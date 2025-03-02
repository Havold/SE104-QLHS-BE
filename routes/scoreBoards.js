import express from "express";
import {
  addScoreBoard,
  deleteScoreBoard,
  getAllScoreBoard,
  getScoreBoard,
  getStudentsWithoutScoreInBoard,
  updateScoreBoard,
  updateStudentsScore,
} from "../controllers/scoreBoard.js";

const router = express.Router();

router.get("/", getAllScoreBoard);
router.get("/:id", getScoreBoard);
router.get("/:id/students", getStudentsWithoutScoreInBoard);
router.post("/", addScoreBoard);
router.delete("/:id/", deleteScoreBoard);
router.put("/:id", updateScoreBoard);
router.put("/:id/scores", updateStudentsScore);

export default router;
