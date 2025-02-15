import express from "express";
const router = express.Router();
import { allusers, registeruser } from "../controller/usercontroller.js";
import { authuser } from "../controller/usercontroller.js";
import { protect } from "../middelewear/auth.js";


 router.post("/", registeruser)
router.get('/', protect,allusers)
router.post("/login",authuser)
export default router;


