import express from "express";
import { getAllResults } from "../controllers/result.js";

const router = express.Router();

router.get("/", getAllResults);

export default router;
