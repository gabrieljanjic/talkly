const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const routes = require("./routes");
const User = require("./models/User");

require("dotenv").config();

const app = express();

app.set("trust proxy", 1);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Database error:", err));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

const onlineUsers = new Set();

app.get("/online-users", (req, res) => {
  res.json({ onlineUsers: Array.from(onlineUsers) });
});

app.use("/", routes);

io.on("connection", async (socket) => {
  const rawCookie = socket.handshake.headers.cookie;
  if (!rawCookie) return socket.disconnect();

  const token = cookie.parse(rawCookie).token;
  if (!token) return socket.disconnect();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
  } catch (err) {
    return socket.disconnect();
  }

  onlineUsers.add(socket.userId);
  io.emit("user_online", socket.userId);

  socket.on("join_room", (roomId) => socket.join(roomId));

  socket.on("send_message", (data) => {
    io.to(data.roomId).emit("receive_message", {
      ...data,
      _id: Date.now().toString(),
    });
  });

  socket.on("leave_room", (roomId) => socket.leave(roomId));

  socket.on("disconnect", async () => {
    onlineUsers.delete(socket.userId);
    await User.findByIdAndUpdate(
      { _id: socket.userId },
      { $set: { lastOnline: new Date() } },
      { new: true },
    );
    io.emit("user_offline", socket.userId);
  });
});

server.listen(3001, () => console.log("Server running on port 3001"));
