import { useState } from "react";

import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginComponent = () => {
  const { setIsAuthenticated, refreshAuth } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!username || !password) return toast.error("All fields are required");
    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login-user`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        },
      );
      if (res.data.status === "success") {
        toast.success(res.data.message);
        setIsAuthenticated(true);
        await refreshAuth();
        setUsername("");
        setPassword("");
        navigate("/");
      }
      setUsername("");
      setPassword("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data.message || "Something wrong");
    } finally {
      setLoading(false);
    }
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white p-2 md:p-3 rounded-md hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Loading..." : "LOG IN"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginComponent;
