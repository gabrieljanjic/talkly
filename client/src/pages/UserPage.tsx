import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import placeholderImage from "../images/portrait_placeholder-1x1.png";
import { TiMessages } from "react-icons/ti";
import { toast } from "react-hot-toast";
import type { User } from "../types/types";

const UserPage = () => {
  const { username } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const findUsersByUsername = async () => {
      try {
        const res = await axios(
          `${import.meta.env.VITE_API_URL}/search-users?query=${username}`,
        );
        setUsers(res.data.users);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };
    findUsersByUsername();
  }, [username]);

  const navigate = useNavigate();
  const handleOpeningRoom = async (id: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-room`,
        {
          userId: id,
        },
        { withCredentials: true },
      );
      const roomId = res.data.room._id;
      navigate(`/chat/${roomId}`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="m-3 flex gap-3 flex-col">
      {users.length > 0 ? (
        users.map((user: User) => {
          return (
            <div
              key={user._id.toString()}
              className="flex justify-between items-center p-2 w-full border border-gray-300 bg-gray-100 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={placeholderImage}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-300"
                />
                <div>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm">
                    @{user.username}
                  </p>
                </div>
              </div>
              <button
                className="px-2 py-1 bg-emerald-500 text-white flex gap-1 items-center rounded cursor-pointer text-sm"
                onClick={() => {
                  handleOpeningRoom(user._id.toString());
                }}
              >
                <TiMessages /> Message
              </button>
            </div>
          );
        })
      ) : (
        <p className="mt-12 text-center">No users found</p>
      )}
    </section>
  );
};

export default UserPage;
