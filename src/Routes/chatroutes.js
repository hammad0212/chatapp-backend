import express from "express";
import { accesschat, addtogroupchat, creategroupchat, fetchchats, removefromgroupchat, renamegroupchat } from "../controller/chatcontroller.js";
import { protect } from "../middelewear/auth.js";
const router = express.Router();


 router.post("/",protect,accesschat)
 router.get("/",protect,fetchchats)
router.post('/group',protect,creategroupchat)
router.put('/rename',protect,renamegroupchat)
router.put('/remove',protect,removefromgroupchat)
router.put('/add',protect,addtogroupchat)

export default router;