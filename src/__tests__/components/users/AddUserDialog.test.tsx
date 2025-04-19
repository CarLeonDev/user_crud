import { render, screen } from "@testing-library/react";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import Provider from "@/app/provider";
import userEvent from "@testing-library/user-event";
import { TEST_IDS } from "@/constants";

const getInputField = (name: string) => {
  return screen.getByTestId(`${TEST_IDS.INPUT_FIELD}-${name}`);
};

describe("AddUserDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
    mockOnSubmit.mockClear();
  });

  it("should not show dialog when open is false", () => {
    render(
      <AddUserDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />,
      { wrapper: Provider }
    );

    expect(
      screen.queryByTestId(TEST_IDS.ADD_USER_DIALOG)
    ).not.toBeInTheDocument();
  });

  it("should show dialog when open is true", () => {
    render(
      <AddUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />,
      { wrapper: Provider }
    );

    expect(screen.getByTestId(TEST_IDS.ADD_USER_DIALOG)).toBeInTheDocument();
  });

  it("should call onOpenChange when dialog is closed", async () => {
    render(
      <AddUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />,
      { wrapper: Provider }
    );

    // Click the cancel button
    await userEvent.click(
      screen.getByTestId(TEST_IDS.ADD_USER_DIALOG_CANCEL_BUTTON)
    );
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);

    // Reset mock
    mockOnOpenChange.mockClear();

    // Click the close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeButton);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("should show validation errors for required fields", async () => {
    render(
      <AddUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />,
      { wrapper: Provider }
    );

    // Try to submit form without filling required fields
    await userEvent.click(
      screen.getByTestId(TEST_IDS.ADD_USER_DIALOG_CREATE_BUTTON)
    );

    // Check for validation errors
    expect(getInputField("name")).not.toBeValid();
    expect(getInputField("username")).not.toBeValid();
    expect(getInputField("email")).not.toBeValid();
    expect(getInputField("address.street")).not.toBeValid();
    expect(getInputField("address.suite")).not.toBeValid();
    expect(getInputField("address.city")).not.toBeValid();
    expect(getInputField("address.zipcode")).not.toBeValid();
  });

  it("should call onSubmit with form data when form is valid", async () => {
    render(
      <AddUserDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />,
      { wrapper: Provider }
    );

    // Fill in the form with valid data
    await userEvent.type(getInputField("name"), "John Doe");
    await userEvent.type(getInputField("username"), "johndoe");
    await userEvent.type(getInputField("email"), "john@example.com");
    await userEvent.type(getInputField("phone"), "1234567890");
    await userEvent.type(getInputField("website"), "https://example.com");
    await userEvent.type(getInputField("address.street"), "123 Main St");
    await userEvent.type(getInputField("address.suite"), "Apt 4B");
    await userEvent.type(getInputField("address.city"), "New York");
    await userEvent.type(getInputField("address.zipcode"), "10001");

    // Submit the form
    await userEvent.click(
      screen.getByTestId(TEST_IDS.ADD_USER_DIALOG_CREATE_BUTTON)
    );

    // Check that onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      phone: "1234567890",
      website: "https://example.com",
      address: {
        street: "123 Main St",
        suite: "Apt 4B",
        city: "New York",
        zipcode: "10001",
      },
    });
  });
});
