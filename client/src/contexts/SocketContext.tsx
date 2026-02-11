import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  isUserOnline: (userId: string) => boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  isUserOnline: () => false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io(
        import.meta.env.VITE_API_URL || "http://localhost:3001",
        { withCredentials: true },
      );

      newSocket.on("user_online", (userId: string) => {
        setOnlineUsers((prev) => new Set(prev).add(userId));
      });

      newSocket.on("user_offline", (userId: string) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });

      newSocket.on("connect", () => setIsConnected(true));
      newSocket.on("disconnect", () => setIsConnected(false));

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers(new Set());
      };
    } else {
      if (socket) socket.close();
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers(new Set());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      if (isAuthenticated && socket && isConnected) {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/online-users`,
          { withCredentials: true },
        );
        setOnlineUsers(new Set(res.data.onlineUsers));
      }
    };

    fetchOnlineUsers();
  }, [isAuthenticated, socket, isConnected]);

  const isUserOnline = (userId: string) => onlineUsers.has(userId);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, onlineUsers, isUserOnline }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
