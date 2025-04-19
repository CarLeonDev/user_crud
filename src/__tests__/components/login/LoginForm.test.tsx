import React from "react";
import { render, screen } from "@testing-library/react";
import { LoginForm } from "@/components/login/LoginForm";
import userEvent from "@testing-library/user-event";
import Provider from "@/app/provider";
import { TEST_IDS } from "@/constants";

const getInputField = (name: string) => {
  return screen.getByTestId(`${TEST_IDS.INPUT_FIELD}-${name}`);
};

describe("LoginForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders email and password inputs", () => {
    render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    expect(getInputField("email")).toBeInTheDocument();
    expect(getInputField("password")).toBeInTheDocument();
  });

  it("calls onSubmit with email and password when form is submitted", async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    const emailInput = getInputField("email");
    const passwordInput = getInputField("password");
    const submitButton = screen.getByTestId(TEST_IDS.SUBMIT_BUTTON);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      "test@example.com",
      "password123"
    );
  });

  it("does not call onSubmit when email is missing", async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    const passwordInput = getInputField("password");
    const submitButton = screen.getByTestId(TEST_IDS.SUBMIT_BUTTON);

    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("does not call onSubmit when password is missing", async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    const emailInput = getInputField("email");
    const submitButton = screen.getByTestId(TEST_IDS.SUBMIT_BUTTON);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("validates email format", async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    const emailInput = getInputField("email");
    const passwordInput = getInputField("password");
    const submitButton = screen.getByTestId(TEST_IDS.SUBMIT_BUTTON);

    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
