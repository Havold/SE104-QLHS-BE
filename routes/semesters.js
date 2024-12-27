import express from "express";
import { getAllSemesters } from "../controllers/semester.js";

const router = express.Router();

router.get("/", getAllSemesters);
// router.get("/:id", getSemester);
// router.delete("/:id", deleteSemester);
// router.post("/", addSemester);
// router.put("/:id", updateSemester);

export default router;
