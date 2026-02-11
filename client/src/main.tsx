import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import App from "./App.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import NoChatSelected from "./pages/NoChatSelected.tsx";
import UserPage from "./pages/UserPage.tsx";
import ExactChatPage from "./pages/ExactChatPage.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import ChatLayout from "./pages/ChatLayout.tsx";
import { SocketProvider } from "./contexts/SocketContext.tsx";

function ServerLoader() {
  return (
    <div className="w-full h-dvh flex items-center justify-center bg-neutral-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-700">Server is loading, please wait...</p>
      </div>
    </div>
  );
}

function AppWrapper() {
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/verify-token`, {
          credentials: "include",
        });
        setServerReady(true);
      } catch (err) {
        setTimeout(checkServer, 5000);
      }
    };

    checkServer();
  }, []);

  if (!serverReady) return <ServerLoader />;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        { path: "users/:username", element: <UserPage /> },
        { path: "*", element: <NotFoundPage /> },
        {
          path: "",
          element: <ChatLayout />,
          children: [
            { path: "", element: <NoChatSelected /> },
            { path: "chat/:roomId", element: <ExactChatPage /> },
          ],
        },
      ],
    },
    { path: "login", element: <LoginPage /> },
    { path: "register", element: <RegisterPage /> },
  ]);

  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
      </SocketProvider>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
);
