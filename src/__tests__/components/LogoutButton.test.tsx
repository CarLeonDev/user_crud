import { render, screen, fireEvent } from "@testing-library/react";
import { LogoutButton } from "@/components/LogoutButton";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import { useHydration } from "@/hooks/useHydration";
import Provider from "@/app/provider";
import { TEST_IDS } from "@/constants";

describe("LogoutButton", () => {
  const mockSetToken = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    (useLocalStorage as jest.Mock).mockReturnValue([
      "mock-token",
      mockSetToken,
    ]);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useHydration as jest.Mock).mockReturnValue(true);
  });

  it("renders when hydrated and token exists", () => {
    render(<LogoutButton />, { wrapper: Provider });
    expect(screen.getByTestId(TEST_IDS.LOGOUT_BUTTON)).toBeInTheDocument();
  });

  it("does not render when not hydrated", () => {
    (useHydration as jest.Mock).mockReturnValue(false);
    render(<LogoutButton />, { wrapper: Provider });
    expect(
      screen.queryByTestId(TEST_IDS.LOGOUT_BUTTON)
    ).not.toBeInTheDocument();
  });

  it("does not render when no token exists", () => {
    (useLocalStorage as jest.Mock).mockReturnValue([null, mockSetToken]);
    render(<LogoutButton />, { wrapper: Provider });
    expect(
      screen.queryByTestId(TEST_IDS.LOGOUT_BUTTON)
    ).not.toBeInTheDocument();
  });

  it("clears token and redirects to login when clicked", () => {
    render(<LogoutButton />, { wrapper: Provider });
    fireEvent.click(screen.getByTestId(TEST_IDS.LOGOUT_BUTTON));

    expect(mockSetToken).toHaveBeenCalledWith(null);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
