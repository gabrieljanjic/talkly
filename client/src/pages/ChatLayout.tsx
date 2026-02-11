import { Outlet, useLocation } from "react-router-dom";
import AllUsersRoomsComponent from "../components/AllUsersRoomsComponent";

const ChatLayout = () => {
  const location = useLocation();
  const isInChat = location.pathname.startsWith("/chat/");

  return (
    <div className="w-full h-full flex">
      <div
        className={`${
          isInChat ? "hidden sm:block" : "block"
        } w-full sm:w-2/5 lg:w-1/3 h-full`}
      >
        <AllUsersRoomsComponent />
      </div>
      <div
        className={`${isInChat ? "block" : "hidden sm:block"} w-full h-full`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
