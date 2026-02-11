import { StrictMode } from "react";
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
);
