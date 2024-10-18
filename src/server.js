import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./confiq/db.js";
import { chats } from "./data/chat.js";
import colors from "colors";
import userRoutes from "./Routes/userRoutes.js";
import { errorHandler, notFound } from "./middelewear/errorMidelleware.js";
connectDB();
const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/user',userRoutes)
app.use(notFound)
app.use(errorHandler)
app.use("/api/chat",chatroutes)

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`Server started on port ${PORT}`.yellow.bold);
});


