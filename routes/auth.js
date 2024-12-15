import express from "express";
import { checkToken, login, logout, register } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

router.get("/check-token", checkToken);

export default router;
