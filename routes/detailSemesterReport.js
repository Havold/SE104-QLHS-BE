import express from "express";
import { getDetailSemesterReport } from "../controllers/detailSemesterReport.js";

const router = express.Router();

router.get("/:id", getDetailSemesterReport);

export default router;
