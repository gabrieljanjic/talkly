const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  lastMessage: { type: String, default: "" },
  lastMessageAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", roomSchema);
