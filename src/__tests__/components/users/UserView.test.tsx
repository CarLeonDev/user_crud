import { render, screen, waitFor } from "@testing-library/react";
import { UserView } from "@/components/users/UserView";
import Provider from "@/app/provider";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUsersStore } from "@/stores/useUsersStore";
import { TEST_IDS } from "@/constants";

const getInputField = (name: string) => {
  return screen.getByTestId(`${TEST_IDS.INPUT_FIELD}-${name}`);
};

describe("UserView", () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(component, { wrapper: Provider });
  };

  const mockUser = {
    id: "1",
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    phone: "123-456-7890",
    website: "johndoe.com",
    address: {
      street: "123 Main St",
      suite: "Apt 4B",
      city: "New York",
      zipcode: "10001",
    },
  };

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    (useUsersStore as unknown as jest.Mock).mockReturnValue({ usersAdded: [] });
  });

  it("should show loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithProvider(<UserView />);
    expect(screen.getByTestId(TEST_IDS.LOADING_SPINNER)).toBeInTheDocument();
  });

  it("should show error state", () => {
    const testError = new Error("Failed to load user");
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: testError,
    });

    renderWithProvider(<UserView />);

    expect(screen.getByTestId(TEST_IDS.ERROR_ALERT)).toBeInTheDocument();
  });

  it("should show user not found state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderWithProvider(<UserView />);

    expect(
      screen.getByTestId(TEST_IDS.EMPTY_STATE_CONTENT)
    ).toBeInTheDocument();
  });

  it("should display user data correctly", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null,
    });

    renderWithProvider(<UserView />);

    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.USER_NAME)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.USER_USERNAME)).toBeInTheDocument();
      expect(getInputField("email")).toHaveValue(mockUser.email);
      expect(getInputField("phone")).toHaveValue(mockUser.phone);
      expect(getInputField("website")).toHaveValue(mockUser.website);
      expect(getInputField("address.street")).toHaveValue(
        mockUser.address.street
      );
      expect(getInputField("address.suite")).toHaveValue(
        mockUser.address.suite
      );
      expect(getInputField("address.city")).toHaveValue(mockUser.address.city);
      expect(getInputField("address.zipcode")).toHaveValue(
        mockUser.address.zipcode
      );
    });
  });

  it("should display user from local store when API data is not available", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    (useUsersStore as unknown as jest.Mock).mockReturnValue({
      usersAdded: [mockUser],
    });

    renderWithProvider(<UserView />);

    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.USER_NAME)).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.USER_USERNAME)).toBeInTheDocument();
    });
  });
});
