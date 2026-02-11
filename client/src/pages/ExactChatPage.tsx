import { useParams } from "react-router-dom";
import ChatComponent from "../components/ChatComponent";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { useAuth } from "../contexts/AuthContext";
import RenderAllMessagesComponent from "../components/RenderAllMessagesComponent";
import type { ChatPartner, Message } from "../types/types";
import { useSocket } from "../contexts/SocketContext";
import UserChatBioComponent from "../components/UserChatBioComponent";

const ExactChatPage = () => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const { roomId } = useParams();
  const { userId } = useAuth();

  useEffect(() => {
    const getMessagesByRoomId = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-messages-by-room-id/${roomId}`,
          { withCredentials: true },
        );
        if (res.data.status === "success") {
          setMessages(res.data.messages);
          setChatPartner(res.data.chatPartner);
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };
    getMessagesByRoomId();
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !socket || !isConnected) return;

    socket.emit("join_room", roomId);

    const handleReceiveMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.emit("leave_room", roomId);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [roomId, socket, isConnected]);

  if (!socket || !isConnected) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Reconnecting...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col h-screen bg-neutral-200 w-full">
      <div className="shrink-0">
        <UserChatBioComponent chatPartner={chatPartner} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <RenderAllMessagesComponent messages={messages} myUserId={userId} />
      </div>
      <div className="shrink-0">
        <ChatComponent socket={socket} />
      </div>
    </section>
  );
};

export default ExactChatPage;
