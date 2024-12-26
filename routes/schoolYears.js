import express from "express";
import {
  addSchoolYear,
  deleteSchoolYear,
  getAllSchoolYears,
  updateSchoolYear,
} from "../controllers/schoolYear.js";

const router = express.Router();

router.get("/", getAllSchoolYears);
router.post("/", addSchoolYear);
router.put("/:id", updateSchoolYear);
router.delete("/:id", deleteSchoolYear);

export default router;
