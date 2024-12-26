import express from "express";
import {
  getAllScoreBoard,
  getScoreBoard,
  getStudentsWithoutScoreInBoard,
} from "../controllers/scoreBoard.js";

const router = express.Router();

router.get("/", getAllScoreBoard);
router.get("/:id", getScoreBoard);
router.get("/:id/students", getStudentsWithoutScoreInBoard);
// router.post("/", addScoreBoard);
// router.delete("/:id", deleteScoreBoard);
// router.put("/:id", updateScoreBoard);

export default router;
