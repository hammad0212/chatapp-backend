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
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
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
    origin: "http://localhost:5173", // ✅ Allow frontend connection
    methods: ["GET", "POST"],
  },
});

// Socket.io Logic
io.on("connection", (socket) => {
  console.log("⚡ Connected to Socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`👤 User joined room: ${room}`);
  });

  socket.on("typing", (room) => socket.to(room).emit("typing"));
  socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat || !chat.users) {
      console.error("❌ Chat users not found");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id !== newMessageReceived.sender._id) {
        socket.to(user._id).emit("message received", newMessageReceived);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
    socket.leave(socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}...`.yellow.bold);
});
