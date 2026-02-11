import { useSocket } from "../contexts/SocketContext";
import placeholderImage from "../images/portrait_placeholder-1x1.png";
import type { ChatPartner } from "../types/types";

const UserChatBioComponent = ({
  chatPartner,
}: {
  chatPartner: ChatPartner | null;
}) => {
  const { isUserOnline } = useSocket();
  const isOnline = chatPartner ? isUserOnline(chatPartner._id) : false;
  const handleTimeAgo = (lastOnline: string) => {
    const now = new Date();
    const last = new Date(lastOnline);
    const diffInSec = Math.floor((now.getTime() - last.getTime()) / 1000);
    if (diffInSec < 60) return "just now";
    if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)}m ago`;
    if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)}h ago`;
    if (diffInSec < 604800) return `${Math.floor(diffInSec / 86400)}d ago`;
    return last.toLocaleDateString();
  };

  if (!chatPartner) {
    return null;
  }
  return (
    <div className="flex items-center gap-4 p-2 bg-white border border-transparent border-b-gray-300">
      <img
        src={placeholderImage}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-300"
      />
      <div>
        <p className="text-gray-900 text-sm sm:text-base">
          {chatPartner.firstName} {chatPartner.lastName}
        </p>
        {isOnline ? (
          <div className="flex gap-1 items-center">
            <p className="w-2 h-2 rounded-full bg-emerald-500"></p>
            <p className="text-xs sm:text-sm text-gray-800">Online</p>
          </div>
        ) : (
          <div className="flex gap-1 items-center">
            <p className="w-2 h-2 rounded-full bg-gray-500"></p>
            <p className="text-xs sm:text-sm text-gray-800">
              {handleTimeAgo(chatPartner?.lastOnline)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserChatBioComponent;
