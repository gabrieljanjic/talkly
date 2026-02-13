import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterComponent = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, refreshAuth } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!firstName || !lastName || !username || !password) {
      return toast.error("All fields are required");
    }

    await toast.promise(
      axios.post(
        `${import.meta.env.VITE_API_URL}/register-user`,
        { firstName, lastName, username, password },
        { withCredentials: true },
      ),
      {
        loading: "Creating account...",
        success: (res) => {
          if (res.data.status === "success") {
            setIsAuthenticated(true);
            refreshAuth();
            navigate("/");
            setFirstName("");
            setLastName("");
            setUsername("");
            setPassword("");
            return "User created successfully!";
          }
          return "Something went wrong";
        },
        error: (err) => err.response?.data?.message || "Registration failed",
      },
    );
  };

  return (
    <section className="w-full h-screen flex items-center justify-center px-2">
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
            className="bg-emerald-600 text-white p-2 md:p-3 rounded-md hover:bg-emerald-700 transition cursor-pointer"
          >
            SIGN UP
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
