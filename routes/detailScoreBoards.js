import express from "express";
import { addStudentsToDTScoreBoard } from "../controllers/detailScoreBoard.js";

const router = express.Router();

router.post("/", addStudentsToDTScoreBoard);

export default router;
