const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const {
  createUser,
  loginUser,
  verifyToken,
  signOut,
  searchUsers,
} = require("./controllers/user.controller");
const { createRoom, getUserRooms } = require("./controllers/room.controller");
const {
  createMessage,
  getMessagesByRoomId,
} = require("./controllers/message.controller");

const authCheck = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      status: "error",
      error: "No token provided",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: "error", message: "Invalid token" });
  }
};

//User
router.post("/register-user", createUser);
router.post("/login-user", loginUser);
router.get("/sign-out", authCheck, signOut);
router.get("/verify-token", verifyToken);
router.get("/search-users", searchUsers);

//Room
router.post("/create-room", authCheck, createRoom);
router.get("/get-user-rooms", authCheck, getUserRooms);

//Message
router.post("/create-message", authCheck, createMessage);
router.get("/get-messages-by-room-id/:roomId", authCheck, getMessagesByRoomId);
module.exports = router;
