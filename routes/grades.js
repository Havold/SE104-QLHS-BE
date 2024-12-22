import express from "express";
import { getAllGrades } from "../controllers/grade.js";

const router = express.Router();

router.get("/", getAllGrades);

export default router;
