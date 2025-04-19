import React from "react";
import { render } from "@testing-library/react";
import { LoginForm } from "@/components/login/LoginForm";
import userEvent from "@testing-library/user-event";
import Provider from "@/app/provider";

describe("LoginForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders email and password inputs", () => {
    const { getByTestId } = render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    expect(getByTestId("email-input")).toBeInTheDocument();
    expect(getByTestId("password-input")).toBeInTheDocument();
  });

  it("calls onSubmit with email and password when form is submitted", async () => {
    const { getByTestId } = render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");
    const submitButton = getByTestId("submit-button");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      "test@example.com",
      "password123"
    );
  });

  it("does not call onSubmit when email is missing", async () => {
    const { getByTestId } = render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    const passwordInput = getByTestId("password-input");
    const submitButton = getByTestId("submit-button");

    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("does not call onSubmit when password is missing", async () => {
    const { getByTestId } = render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    const emailInput = getByTestId("email-input");
    const submitButton = getByTestId("submit-button");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("validates email format", async () => {
    const { getByTestId } = render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");
    const submitButton = getByTestId("submit-button");

    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
