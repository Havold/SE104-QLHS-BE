import express from "express";
import { getDetailSubjectReport } from "../controllers/detailSubjectReport.js";

const router = express.Router();

router.get("/:id", getDetailSubjectReport);

export default router;
