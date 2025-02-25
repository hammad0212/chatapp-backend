import asyncHandler from "express-async-handler";
import Message from "../models/MessageModel.js";
import User from "../models/Usermodel.js";
import Chat from "../models/chatmodel.js";

// ✅ Get All Messages in a Chat
// @route  GET /api/message/:chatId
// @access Protected
export const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat")
      .exec(); // ✅ Added `.exec()` for better query execution

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// ✅ Send a New Message
// @route  POST /api/message
// @access Protected
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    let message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    // ✅ Corrected `.populate()` calls (removed `.execPopulate()`)
    message = await Message.findById(message._id)
      .populate("sender", "name pic")
      .populate("chat")
      .populate({
        path: "chat.users",
        select: "name pic email",
      })
      .exec();

    // ✅ Update latest message in chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
