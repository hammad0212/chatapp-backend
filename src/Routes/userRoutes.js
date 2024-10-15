import express from "express";
const router = express.Router();
import { registeruser } from "../controller/usercontroller.js";
 router.post("/register", registeruser)


// router.post("/login",authuser)
export default router;


