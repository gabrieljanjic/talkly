import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import placeholderImage from "../images/portrait_placeholder-1x1.png";
import { Link, useParams } from "react-router-dom";
import SearchUserComponent from "./SearchUserComponent";
import { FaArrowUp } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import type { Room } from "../types/types";

const AllUsersRoomsComponent = () => {
  const { rooms, setRooms } = useAuth();
  const { roomId } = useParams();
  useEffect(() => {
    const getAllUserRooms = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-user-rooms`,
          { withCredentials: true },
        );
        if (res.data.data) {
          setRooms(res.data.data);
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };
    getAllUserRooms();
  }, []);
  return (
    <section className="bg-white h-screen p-4">
      <h4 className="text-gray-700  text-2xl font-semibold mb-1 sm:mb-3">
        Chats
      </h4>
      <SearchUserComponent />
      {rooms.length > 0 ? (
        rooms.map((room: Room) => {
          return (
            <Link to={`/chat/${room._id}`} key={room._id}>
              <div
                className={`flex gap-4 p-2 bg-gray-50 border border-neutral-200 rounded mt-3 
                ${room._id === roomId ? "bg-neutral-200" : ""}`}
              >
                <img
                  src={placeholderImage}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm md:font-base">
                    {room.participants[0].firstName}{" "}
                    {room.participants[0].lastName}
                  </p>
                  <p className="text-gray-700 text-xs md:text-sm truncate">
                    {room.lastMessage}
                  </p>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="flex flex-col items-center mt-3 text-gray-700">
          <FaArrowUp />
          Pick a contact and say hi.
        </div>
      )}
    </section>
  );
};

export default AllUsersRoomsComponent;
