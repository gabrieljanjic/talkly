import { render, screen, waitFor } from "@testing-library/react";
import AllUsersRoomsComponent from "../../src/components/AllUsersRoomsComponent";
import { server } from "../server";
import { http, HttpResponse } from "msw";
import { usersRoomsData } from "../data/usersRoomsData";
import { useAuth } from "../../src/contexts/AuthContext";
import { createMockAuth } from "../helpers/mockAuth";
import { BrowserRouter } from "react-router-dom";

vi.mock("../../src/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    error: vi.fn(),
  },
}));

import { toast } from "react-hot-toast";

describe("AllUsersRoomsComponent", () => {
  it("should return rooms with users", async () => {
    vi.mocked(useAuth).mockReturnValue(
      createMockAuth({
        rooms: [...usersRoomsData],
        setRooms: vi.fn(),
      }),
    );
    server.use(
      http.get("http://localhost:3001/get-user-rooms", () =>
        HttpResponse.json({ data: usersRoomsData }),
      ),
    );
    render(
      <BrowserRouter>
        <AllUsersRoomsComponent />
      </BrowserRouter>,
    );

    expect(await screen.findByText("no")).toBeInTheDocument();
    expect(await screen.findByText("yes")).toBeInTheDocument();
    expect(await screen.findByText(/ivan/i)).toBeInTheDocument();
    expect(await screen.findByText(/luka/i)).toBeInTheDocument();
  });
  it("should return generic message if no user rooms", async () => {
    vi.mocked(useAuth).mockReturnValue(
      createMockAuth({
        rooms: [],
        setRooms: vi.fn(),
      }),
    );
    server.use(
      http.get("http://localhost:3001/get-user-rooms", () =>
        HttpResponse.json({}),
      ),
    );
    render(
      <BrowserRouter>
        <AllUsersRoomsComponent />
      </BrowserRouter>,
    );
    expect(await screen.findByText(/pick a contact/i)).toBeInTheDocument();
  });
  it("should return toast error if something went wrong", async () => {
    vi.mocked(useAuth).mockReturnValue(
      createMockAuth({
        rooms: [],
        setRooms: vi.fn(),
      }),
    );
    server.use(
      http.get("http://localhost:3001/get-user-rooms", () =>
        HttpResponse.error(),
      ),
    );
    render(
      <BrowserRouter>
        <AllUsersRoomsComponent />
      </BrowserRouter>,
    );
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
