import express from "express";
import { getAllClasses, getClass } from "../controllers/class.js";

const router = express.Router();

router.get("/", getAllClasses);
router.get("/:id", getClass);

export default router;
