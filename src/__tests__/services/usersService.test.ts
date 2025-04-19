import { getUsers, getUser } from "@/services/usersService";
import { API_URL } from "@/constants";
import { mockUser } from "@/__mocks__/user.mock";
import { mockUsers } from "@/__mocks__/users.mock";

// Mock the global fetch function
global.fetch = jest.fn();

describe("usersService", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should fetch users successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockUsers),
      });

      const result = await getUsers({ page: 1, size: 10 });

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/users`);
      expect(result).toEqual({
        data: mockUsers,
        total: mockUsers.length,
      });
    });

    it("should handle fetch errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(getUsers({ page: 1, size: 10 })).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("getUser", () => {
    it("should fetch a single user successfully", async () => {
      const userId = "1";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockUser),
      });

      const result = await getUser(userId);

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/users/${userId}`);
      expect(result).toEqual(mockUser);
    });

    it("should handle fetch errors for single user", async () => {
      const userId = "1";
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(getUser(userId)).rejects.toThrow("Network error");
    });
  });
});
