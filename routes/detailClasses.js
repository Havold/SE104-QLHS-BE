import express from "express";
import {
  addDetailClass,
  deleteDetailClass,
  getAllDetailClasses,
  getDetailClass,
  updateDetailClass,
} from "../controllers/detailClass.js";

const router = express.Router();

router.get("/", getAllDetailClasses);
router.get("/:id", getDetailClass);
router.post("/", addDetailClass);
router.delete("/:id", deleteDetailClass);
router.put("/:id", updateDetailClass);

export default router;
