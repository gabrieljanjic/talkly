const Message = require("../models/Message");
const Room = require("../models/Room");
const User = require("../models/User");

exports.createMessage = async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const myUserId = req.user.id;
    const newMessage = await Message.create({
      roomId: roomId,
      senderId: myUserId,
      text: message,
    });

    await Room.findOneAndUpdate(
      { _id: roomId },
      { $set: { lastMessage: message, lastMessageAt: new Date() } },
      { new: true },
    );
    res.status(200).json({ status: "success", message: newMessage });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.getMessagesByRoomId = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const myUserId = req.user.id;
    const roomExists = await Room.findById(roomId);
    if (!roomExists) {
      return res.status(404).json({ message: "Room not found" });
    }

    const amIinRoom = roomExists.participants.includes(myUserId);
    if (!amIinRoom) {
      return res.status(403).json({ message: "You are not part of this room" });
    }

    const chatPartnerId = roomExists.participants.find(
      (participantId) => participantId.toString() !== myUserId.toString(),
    );

    const chatPartner = await User.findOne({ _id: chatPartnerId }).select(
      "-password",
    );
    const allMessages = await Message.find({ roomId });
    res.status(200).json({
      status: "success",
      chatPartner: chatPartner,
      messages: allMessages,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};
