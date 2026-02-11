import { Link, Outlet } from "react-router-dom";
import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import { useAuth } from "./contexts/AuthContext";
import messageIllustration from "./images/message_illustration.svg";
import { IoExitOutline } from "react-icons/io5";

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <main className="w-full h-dvh m-auto flex flex-col sm:flex-row overflow-hidden">
      <div className="shrink-0">
        <NavbarComponent />
      </div>
      {isAuthenticated ? (
        <div className="flex-1 h-full min-h-0">
          <Outlet />
        </div>
      ) : (
        <section className="w-full flex flex-col items-center h-full justify-center bg-linear-to-br from-neutral-50 to-gray-100">
          <div className="max-w-md text-center px-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to Talkly
            </h2>
            <div className="my-8">
              <img
                src={messageIllustration}
                alt="Chat illustration"
                className="w-40 mx-auto drop-shadow-lg"
              />
            </div>
            <p className=" text-gray-600 mb-2">
              You have to be logged in to see messages
            </p>
            <Link
              className="text-blue-400 hover:text-blue-500 hover:underline flex gap-2 items-center justify-center"
              to="/login"
            >
              Login
              <p>
                <IoExitOutline />
              </p>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
