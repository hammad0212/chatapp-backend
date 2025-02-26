import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./confiq/db.js";
import userRoutes from "./Routes/userRoutes.js";
import chatRoutes from "./Routes/chatroutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import { errorHandler, notFound } from "./middelewear/errorMidelleware.js";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // ✅ Allow frontend to access backend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
console.log("Registered Routes:", app._router.stack.map(r => r.route && r.route.path));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = createServer(app);

// ✅ Fix Socket.io CORS Issue
const io = new IOServer(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Store typing users for each chat room
const typingUsers = {};

// ✅ Socket.io Logic
io.on("connection", (socket) => {
  console.log("⚡ Connected to Socket.io");

  // User setup
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // User joins chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`👤 User joined room: ${room}`);
  });

  // ✅ Handle typing feature correctly
  socket.on("typing", (room, userId) => {
    if (!typingUsers[room]) {
      typingUsers[room] = new Set();
    }
    typingUsers[room].add(userId);
    io.to(room).emit("typing", Array.from(typingUsers[room])); // Send list of typing users
  });

  socket.on("stop typing", (room, userId) => {
    if (typingUsers[room]) {
      typingUsers[room].delete(userId);
      if (typingUsers[room].size === 0) {
        io.to(room).emit("stop typing");
      }
    }
  });

  // ✅ Handle new messages & real-time updates
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat || !chat.users) {
      console.error("❌ Chat users not found");
      return;
    }

    // ✅ Emit to the entire chat room instead of individual users
    io.to(chat._id).emit("message received", newMessageReceived);

    // ✅ Stop typing when message is sent
    io.to(chat._id).emit("stop typing");
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}...`.yellow.bold);
});
