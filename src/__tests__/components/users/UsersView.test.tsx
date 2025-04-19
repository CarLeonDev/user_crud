import { useRouter } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import Provider from "@/app/provider";
import { UsersView } from "@/components/users/UsersView";
import { TEST_IDS } from "@/constants";

import { useUsersInfinite } from "@/hooks/useUsersInfinite";
import { mockUsers } from "@/__mocks__/users.mock";
describe("UsersView", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockQueryClient = {
    invalidateQueries: jest.fn(),
  };

  const renderWithProvider = (component: React.ReactElement) => {
    return render(component, { wrapper: Provider });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
    (useUsersInfinite as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            data: mockUsers,
            total: mockUsers.length,
          },
        ],
      },
      error: null,
      isLoading: false,
      isFetching: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });
  });

  it("should show search results when searching", async () => {
    renderWithProvider(<UsersView />);

    const searchInput = screen.getByTestId(TEST_IDS.SEARCH_INPUT);
    await userEvent.type(searchInput, "John");

    expect(searchInput).toHaveValue("John");
  });

  it("should show error alert when there is an error", () => {
    // Override the mock to return an error
    jest
      .spyOn(require("@/hooks/useUsersInfinite"), "useUsersInfinite")
      .mockReturnValue({
        data: null,
        error: new Error("Failed to load users"),
        isLoading: false,
        isFetching: false,
        isFetchingNextPage: false,
        fetchNextPage: jest.fn(),
        refetch: jest.fn(),
      });

    renderWithProvider(<UsersView />);

    expect(screen.getByTestId(TEST_IDS.ERROR_ALERT)).toBeInTheDocument();
  });

  it("should show loading state", () => {
    // Override the mock to return loading state
    jest
      .spyOn(require("@/hooks/useUsersInfinite"), "useUsersInfinite")
      .mockReturnValue({
        data: null,
        error: null,
        isLoading: true,
        isFetching: false,
        isFetchingNextPage: false,
        fetchNextPage: jest.fn(),
        refetch: jest.fn(),
      });

    renderWithProvider(<UsersView />);

    expect(
      screen.getByTestId(TEST_IDS.INFINITE_TABLE_LOADING_ROW)
    ).toBeInTheDocument();
  });

  it("should show delete dialog when delete button is clicked", async () => {
    renderWithProvider(<UsersView />);

    expect(screen.getByTestId(TEST_IDS.INFINITE_TABLE)).toBeInTheDocument();

    // Click the delete button
    const deleteButton = screen.getAllByTestId(TEST_IDS.DELETE_USER_BUTTON)[0];
    await userEvent.click(deleteButton);

    // Check if delete dialog is shown
    expect(screen.getByTestId(TEST_IDS.DELETE_USER_DIALOG)).toBeInTheDocument();
  });

  it("should show add user dialog when add button is clicked", async () => {
    jest
      .spyOn(require("@/hooks/useUsersInfinite"), "useUsersInfinite")
      .mockClear();

    renderWithProvider(<UsersView />);

    // Click the add button
    const addButton = screen.getAllByTestId(TEST_IDS.ADD_USER_BUTTON)[0];
    await userEvent.click(addButton);

    // Check if add dialog is shown
    expect(screen.getByTestId(TEST_IDS.ADD_USER_DIALOG)).toBeInTheDocument();
  });
});
