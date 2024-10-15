import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { chats } from "./data/chat.js";
const app = express();
app.use(cors());
app.get('/', (req, res) => {
    res.send("Hello World!");
})
app.get('/api/data', (req, res) => {
    res.send(chats);
})
app.get('/api/data/:id', (req, res) => {
    const id = req.params.id;
    const chat = chats.find((chat) => chat._id === id);
    res.send(chat);
})

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`Server started on port ${PORT}`);
});


