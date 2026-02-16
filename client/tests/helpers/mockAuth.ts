import { vi } from "vitest";
import type { AuthContextType } from "../../src/types/types";

export const createMockAuth = (
  overrides?: Partial<AuthContextType>,
): AuthContextType => ({
  isAuthenticated: false,
  setIsAuthenticated: vi.fn(),
  user: null,
  loading: false,
  userId: null,
  username: null,
  firstName: null,
  lastName: null,
  refreshAuth: vi.fn(),
  rooms: [],
  setRooms: vi.fn(),
  updateLastMessage: vi.fn(),
  ...overrides,
});
