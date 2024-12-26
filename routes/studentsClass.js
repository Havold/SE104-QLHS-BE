import express from "express";
import {
  addStudentsToClass,
  getStudentsFromClass,
  removeStudentsFromClass,
} from "../controllers/studentClass.js";

const router = express.Router();

router.post("/", addStudentsToClass);
router.get("/:id", getStudentsFromClass);
router.delete("/:id", removeStudentsFromClass);

export default router;
