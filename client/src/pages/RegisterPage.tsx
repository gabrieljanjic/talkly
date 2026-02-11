import { useState } from "react";

import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterComponent = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, refreshAuth } = useAuth();

  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/register-user`,
        { firstName, lastName, username, password },
        {
          withCredentials: true,
        },
      );
      if (res.data.status === "success") {
        toast.success("User created successfully");
        refreshAuth();
        navigate("/");
        setIsAuthenticated(true);
      } else {
        toast.error("Something went wrong");
      }
      setUsername("");
      setFirstName("");
      setLastName("");
      setPassword("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center px-2 ">
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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="border border-gray-300 rounded-md p-2 md:p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="border border-gray-300 rounded-md p-2 md:p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="border border-gray-300 rounded-md p-2 md:p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 md:p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white p-2 md:p-3 rounded-md hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "SIGN UP"}
          </button>
          <div className="flex gap-1 items-center justify-center">
            <p className="text-gray-700">Already have an account?</p>
            <Link to="/login" className="text-blue-500">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterComponent;
