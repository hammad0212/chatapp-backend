import express from "express";
//const router = express.Router();

import { allMessages,sendMessage } from "../controller/messageControllers.js";
import { protect } from "../middelewear/auth.js";

const router = express.Router();

router.get("/:chatId",protect, allMessages);
router.post("/",protect, sendMessage);

export default router;


