import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import type { User, Room } from "../types/types";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  loading: boolean;
  userId: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  refreshAuth: () => Promise<void>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  updateLastMessage: (roomId: string, message: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Error");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const checkAuth = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/verify-token`,
        { withCredentials: true },
      );
      if (res.data.status === "success") {
        setIsAuthenticated(true);
        setUser({
          _id: res.data.user.id || res.data.user._id,
          username: res.data.user.username,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const updateLastMessage = (roomId: string, message: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room._id === roomId ? { ...room, lastMessage: message } : room,
      ),
    );
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    loading,
    userId: user?._id || null,
    username: user?.username || null,
    firstName: user?.firstName || null,
    lastName: user?.lastName || null,
    refreshAuth: checkAuth,
    rooms,
    setRooms,
    updateLastMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
