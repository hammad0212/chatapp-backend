import express from "express";
const router = express.Router();
import { registeruser } from "../controller/usercontroller.js";
import { authuser } from "../controller/usercontroller.js";
 router.post("/", registeruser)


router.post("/login",authuser)
export default router;


