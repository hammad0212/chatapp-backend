import express from "express";
const router = express.Router();


// router.post("/",protect,accesschat)
// router.get("/",protect,fetchchat)
router.post('/group',protect,createGroupChat)

export default router;