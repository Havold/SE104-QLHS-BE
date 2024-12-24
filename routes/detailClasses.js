import express from "express";
import {
  addDetailClass,
  deleteDetailClass,
  getAllDetailClasses,
  getDetailClass,
} from "../controllers/detailClass.js";

const router = express.Router();

router.get("/", getAllDetailClasses);
router.get("/:id", getDetailClass);
router.post("/", addDetailClass);
router.delete("/:id", deleteDetailClass);

export default router;
