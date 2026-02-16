import { render, screen } from "@testing-library/react";

import App from "../../src/App";
vi.mock("../../src/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../src/contexts/AuthContext";
import { createMockAuth } from "../helpers/mockAuth";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

describe("group", () => {
  it("should return NoChatPage if user is not logged in", async () => {
    vi.mocked(useAuth).mockReturnValue(
      createMockAuth({
        isAuthenticated: false,
      }),
    );
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(screen.getByText(/have to be logged/i)).toBeInTheDocument();
    const loginBtn = screen.getByTestId("page-login-link");
    expect(loginBtn).toBeInTheDocument();
  });
});
