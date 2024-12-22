import express from "express";
import {
  addClass,
  deleteClass,
  getAllClasses,
  getClass,
} from "../controllers/class.js";

const router = express.Router();

router.get("/", getAllClasses);
router.get("/:id", getClass);
router.post("/", addClass);
router.delete("/:id", deleteClass);

export default router;
