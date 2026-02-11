import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import placeholderImage from "../images/portrait_placeholder-1x1.png";
import { IoExitOutline } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import { toast } from "react-toastify";

const NavbarComponent = () => {
  const { username, refreshAuth, isAuthenticated, setIsAuthenticated } =
    useAuth();
  const handleSignOut = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/sign-out`, {
        withCredentials: true,
      });
      if (res.data.status === "success") {
        toast.success(res.data.message);
        setIsAuthenticated(false);
        refreshAuth();
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(true);
    }
  };

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return (
    <nav className="bg-emerald-500 p-2 flex h-screen justify-between items-center">
      <div className="flex flex-col items-center gap-5">
        <Link to="/">
          <button className="bg-white py-1 px-2 rounded cursor-pointer text-gray-800">
            <FiMessageSquare className="text-lg" />
          </button>
        </Link>
        {!isAuthenticated ? (
          <>
            <Link to="/login">
              <button className="bg-white py-1 px-2 rounded cursor-pointer text-gray-800">
                <div className="flex flex-col items-center">
                  <IoExitOutline className="text-lg" />
                  <p>Login</p>{" "}
                </div>
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-white py-1 px-2 rounded cursor-pointer text-gray-800">
                <div className="flex flex-col items-center">
                  <VscAccount className="text-lg" />
                  <p>Register</p>
                </div>
              </button>
            </Link>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <img src={placeholderImage} className="w-8 h-8 rounded-full" />
              <p className="text-white">{username}</p>
            </div>
            <button
              className="bg-white py-1 px-2 rounded cursor-pointer text-gray-800"
              onClick={() => handleSignOut()}
            >
              <IoExitOutline className="text-lg" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavbarComponent;
