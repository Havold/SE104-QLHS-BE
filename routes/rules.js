import express from "express";
import { addRule, getAllRules, updateRule } from "../controllers/rule.js";

const router = express.Router();

router.get("/", getAllRules);
// router.get("/:id", getClass);
router.post("/", addRule);
// router.delete("/:id", deleteClass);
router.put("/:id", updateRule);

export default router;
