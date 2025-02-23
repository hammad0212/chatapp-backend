import express from "express";
const router = express.Router();
import { allusers, registeruser, authuser } from "../controller/usercontroller.js";
import { protect } from "../middelewear/auth.js";

// ✅ Correct route definitions
router.post("/", registeruser);
router.get("/", protect, allusers);
router.post("/login", authuser);

export default router;
