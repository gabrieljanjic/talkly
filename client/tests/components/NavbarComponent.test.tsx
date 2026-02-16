import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import NavbarComponent from "../../src/components/NavbarComponent";

vi.mock("../../src/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../src/contexts/AuthContext";
import { createMockAuth } from "../helpers/mockAuth";
import { http, HttpResponse } from "msw";
import { server } from "../server";

vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
  },
}));

import { toast } from "react-hot-toast";

describe("NavbarComponent", () => {
  it("should show login and register when no one is logged", () => {
    vi.mocked(useAuth).mockReturnValue(
      createMockAuth({
        isAuthenticated: false,
      }),
    );
    render(
      <BrowserRouter>
        <NavbarComponent />
      </BrowserRouter>,
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("should see user first name when user is logged in", async () => {
    vi.mocked(useAuth).mockReturnValue(
      createMockAuth({
        isAuthenticated: true,
        firstName: "Gabriel",
      }),
    );
    render(
      <BrowserRouter>
        <NavbarComponent />
      </BrowserRouter>,
    );
    expect(await screen.findByText(/gabriel/i)).toBeInTheDocument();
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });
  it("should return success in toast", async () => {
    server.use(
      http.get("http://localhost:3001/sign-out", () =>
        HttpResponse.json({
          status: "success",
          message: "Successfully signed out",
        }),
      ),
    );
    vi.mocked(useAuth).mockReturnValue(
      createMockAuth({
        isAuthenticated: true,
        firstName: "Gabriel",
      }),
    );
    render(
      <BrowserRouter>
        <NavbarComponent />
      </BrowserRouter>,
    );
    const signOut = screen.getByText(/sign out/i);
    expect(signOut).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(signOut);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });
  it("should return error and setIsAuth true", async () => {
    server.use(
      http.get("http://localhost:3001/sign-out", () =>
        HttpResponse.json({
          status: "error",
          message: "Something went wrong",
        }),
      ),
    );

    const authMock = createMockAuth({
      isAuthenticated: true,
    });

    vi.mocked(useAuth).mockReturnValue(authMock);
    render(
      <BrowserRouter>
        <NavbarComponent />
      </BrowserRouter>,
    );
    const signOut = screen.getByText(/sign out/i);
    expect(signOut).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(signOut);
    await waitFor(() => {
      expect(authMock.setIsAuthenticated).toHaveBeenCalledWith(true);
    });
  });
  it("should catch error and setIsAuth true", async () => {
    server.use(
      http.get("http://localhost:3001/sign-out", () => HttpResponse.error()),
    );

    const authMock = createMockAuth({
      isAuthenticated: true,
    });

    vi.mocked(useAuth).mockReturnValue(authMock);
    render(
      <BrowserRouter>
        <NavbarComponent />
      </BrowserRouter>,
    );
    const signOut = screen.getByText(/sign out/i);
    expect(signOut).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(signOut);
    await waitFor(() => {
      expect(authMock.setIsAuthenticated).toHaveBeenCalledWith(true);
    });
  });
});
