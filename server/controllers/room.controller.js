const Room = require("../models/Room");

exports.createRoom = async (req, res) => {
  try {
    const myUserId = req.user.id;
    const otherUserId = req.body.userId;
    if (myUserId === otherUserId) {
      return res
        .status(400)
        .json({ message: "You cannot create a room with yourself" });
    }
    const existingRoom = await Room.findOne({
      participants: { $all: [myUserId, otherUserId] },
    });
    if (existingRoom) {
      return res
        .status(200)
        .json({ message: "Room already exists", room: existingRoom });
    }
    const newRoom = await Room.create({
      participants: [myUserId, otherUserId],
    });
    res.status(201).json({ message: "Room created", room: newRoom });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.getUserRooms = async (req, res) => {
  try {
    const myUserId = req.user.id;
    const rooms = await Room.find({ participants: myUserId })
      .select("_id lastMessage participants createdAt")
      .populate({
        path: "participants",
        select: "username firstName lastName",
        match: { _id: { $ne: myUserId } },
      });
    res.status(200).json({ status: "success", data: rooms });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
