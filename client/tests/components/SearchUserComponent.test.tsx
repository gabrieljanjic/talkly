import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchUserComponent from "../../src/components/SearchUserComponent";
import { vi } from "vitest";

const mockNavigate = vi.fn();

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SearchUserComponent", () => {
  it("should update input value and search on Enter", async () => {
    render(<SearchUserComponent />);
    const input = screen.getByPlaceholderText("Search");
    const user = userEvent.setup();
    await user.type(input, "Test");
    expect((input as HTMLInputElement).value).toBe("Test");
    await user.keyboard("{Enter}");
    expect(mockNavigate).toHaveBeenCalledWith("/users/test");
  });
  it("should search on button", async () => {
    render(<SearchUserComponent />);
    const input = screen.getByPlaceholderText("Search");
    const user = userEvent.setup();
    await user.type(input, "Test2");
    await user.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/users/test2");
  });
});
