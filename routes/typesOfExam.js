import express from "express";
import { getAllTypesOfExam } from "../controllers/typeOfExam.js";

const router = express.Router();

router.get("/", getAllTypesOfExam);

export default router;
