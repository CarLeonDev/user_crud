import { render, screen } from "@testing-library/react";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import Provider from "@/app/provider";
import userEvent from "@testing-library/user-event";
import { mockUser } from "@/__mocks__/user.mock";
import { TEST_IDS } from "@/constants";

describe("DeleteUserDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
    mockOnDelete.mockClear();
  });

  it("should not show dialog when user is null", () => {
    render(
      <DeleteUserDialog
        user={null}
        open={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
      />,
      { wrapper: Provider }
    );

    expect(
      screen.queryByTestId(TEST_IDS.DELETE_USER_DIALOG)
    ).not.toBeInTheDocument();
  });

  it("should not show dialog when open is false", () => {
    render(
      <DeleteUserDialog
        user={mockUser}
        open={false}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
      />,
      { wrapper: Provider }
    );

    expect(
      screen.queryByTestId(TEST_IDS.DELETE_USER_DIALOG)
    ).not.toBeInTheDocument();
  });

  it("should show dialog when open is true", () => {
    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
      />,
      { wrapper: Provider }
    );

    expect(screen.getByTestId(TEST_IDS.DELETE_USER_DIALOG)).toBeInTheDocument();
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });

  it("should call onDelete when delete button is clicked", async () => {
    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
      />,
      { wrapper: Provider }
    );

    await userEvent.click(
      screen.getByTestId(TEST_IDS.DELETE_USER_DIALOG_DELETE_BUTTON)
    );
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("should call onOpenChange when dialog is closed", async () => {
    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
      />,
      { wrapper: Provider }
    );

    // Click the cancel button
    await userEvent.click(
      screen.getByTestId(TEST_IDS.DELETE_USER_DIALOG_CANCEL_BUTTON)
    );
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);

    // Reset mock
    mockOnOpenChange.mockClear();

    // Click the close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeButton);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
