import { Outlet } from "react-router-dom";
import AllUsersRoomsComponent from "../components/AllUsersRoomsComponent";

const ChatLayout = () => {
  return (
    <div className="w-full h-screen">
      <div className="flex">
        <div className="w-2/5">
          <AllUsersRoomsComponent />
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
