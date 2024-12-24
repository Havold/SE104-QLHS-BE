import express from "express";
import { getAllSchoolYears } from "../controllers/schoolYear.js";

const router = express.Router();

router.get("/", getAllSchoolYears);

export default router;
