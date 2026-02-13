import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginComponent = () => {
  const { setIsAuthenticated, refreshAuth } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!username || !password) return toast.error("All fields are required");

    await toast.promise(
      axios.post(
        `${import.meta.env.VITE_API_URL}/login-user`,
        { username, password },
        { withCredentials: true },
      ),
      {
        loading: "Logging in...",
        success: (res) => {
          if (res.data.status === "success") {
            setIsAuthenticated(true);
            refreshAuth();
            setUsername("");
            setPassword("");
            navigate("/");
            return res.data.message;
          }
          return "Unknown response";
        },
        error: (err) => err.response?.data.message || "Login failed",
      },
    );
  };

  return (
    <section className="w-full h-screen flex items-center justify-center px-2 rounded-lg">
      <div className="border border-gray-300 bg-white p-8 rounded-2xl w-full max-w-md flex flex-col items-center gap-6 custom-box-shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Talkly
          </h1>
        </div>
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="border border-gray-300 rounded-md p-2 md:p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 md:p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white p-2 md:p-3 rounded-md hover:bg-emerald-700 transition cursor-pointer"
          >
            LOG IN
          </button>
          <div className="flex gap-1 items-center justify-center">
            <p className="text-gray-700">Don't have an account?</p>
            <Link to="/register" className="text-blue-500">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginComponent;
