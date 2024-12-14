import express from "express";
import { getAllDetailClasses } from "../controllers/detailClass.js";

const router = express.Router();

router.get("/", getAllDetailClasses);

export default router;
