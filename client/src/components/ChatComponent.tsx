import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import { BsEmojiGrin, BsSend } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";

type ChatComponentProps = {
  socket: Socket;
};

const ChatComponent = ({ socket }: ChatComponentProps) => {
  const { roomId } = useParams();
  const { userId, updateLastMessage } = useAuth();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const sendMessage = async () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      text: message,
      senderId: userId,
      roomId: roomId,
      createdAt: new Date().toISOString(),
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/create-message`,
        { roomId, message },
        { withCredentials: true },
      );
      updateLastMessage(roomId!, message);
      setMessage("");
      setShowEmojiPicker(false);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setMessage((prev) => {
      return prev + emoji.emoji;
    });
  };

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleDocumentOutsideEmojiWindow = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleDocumentOutsideEmojiWindow);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleDocumentOutsideEmojiWindow,
      );
    };
  }, []);

  return (
    <div className="mt-3 p-3 flex items-center gap-2 border border-transparent border-t-gray-300">
      <input
        type="text"
        value={message}
        className="rounded bg-white text-gray-700 p-2 text-lg w-full"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />
      <div className="relative">
        <button
          className="bg-yellow-400 p-2 rounded text-lg relative"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <BsEmojiGrin />
        </button>
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-12 right-0">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
      <button
        onClick={sendMessage}
        className="cursor-pointer bg-emerald-600 p-2 rounded text-lg"
      >
        <BsSend className="text-white" />
      </button>
    </div>
  );
};

export default ChatComponent;
