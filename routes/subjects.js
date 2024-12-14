import express from "express";
import { getAllSubjects, getSubject } from "../controllers/subject.js";

const router = express.Router();

router.get("/", getAllSubjects);
router.get("/:id", getSubject);

export default router;
