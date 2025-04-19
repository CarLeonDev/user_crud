import React from "react";
import { render } from "@testing-library/react";
import { LoginForm } from "@/components/login/LoginForm";
import userEvent from "@testing-library/user-event";
import Provider from "@/app/provider";
import { TEST_IDS } from "@/constants";
describe("LoginForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders email and password inputs", () => {
    const { getByTestId } = render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    expect(getByTestId(TEST_IDS.EMAIL_INPUT)).toBeInTheDocument();
    expect(getByTestId(TEST_IDS.PASSWORD_INPUT)).toBeInTheDocument();
  });

  it("calls onSubmit with email and password when form is submitted", async () => {
    const { getByTestId } = render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    const emailInput = getByTestId(TEST_IDS.EMAIL_INPUT);
    const passwordInput = getByTestId(TEST_IDS.PASSWORD_INPUT);
    const submitButton = getByTestId(TEST_IDS.SUBMIT_BUTTON);

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

    const passwordInput = getByTestId(TEST_IDS.PASSWORD_INPUT);
    const submitButton = getByTestId(TEST_IDS.SUBMIT_BUTTON);

    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("does not call onSubmit when password is missing", async () => {
    const { getByTestId } = render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    const emailInput = getByTestId(TEST_IDS.EMAIL_INPUT);
    const submitButton = getByTestId(TEST_IDS.SUBMIT_BUTTON);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("validates email format", async () => {
    const { getByTestId } = render(<LoginForm onSubmit={mockOnSubmit} />, {
      wrapper: Provider,
    });

    const emailInput = getByTestId(TEST_IDS.EMAIL_INPUT);
    const passwordInput = getByTestId(TEST_IDS.PASSWORD_INPUT);
    const submitButton = getByTestId(TEST_IDS.SUBMIT_BUTTON);

    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
