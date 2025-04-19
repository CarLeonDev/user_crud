import { useRouter } from "next/navigation";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginView } from "@/components/login/LoginView";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Provider from "@/app/provider";
import { TEST_IDS } from "@/constants";

describe("LoginView", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useLocalStorage as jest.Mock).mockReturnValue([null, jest.fn()]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to /users when authToken is present", () => {
    (useLocalStorage as jest.Mock).mockReturnValue(["some-token", jest.fn()]);

    render(<LoginView />, { wrapper: Provider });

    expect(mockRouter.push).toHaveBeenCalledWith("/users");
  });

  it("calls handleSubmit with email and password when form is submitted", async () => {
    const setAuthToken = jest.fn();
    (useLocalStorage as jest.Mock).mockReturnValue([null, setAuthToken]);

    render(<LoginView />, { wrapper: Provider });

    const emailInput = screen.getByTestId(TEST_IDS.EMAIL_INPUT);
    const passwordInput = screen.getByTestId(TEST_IDS.PASSWORD_INPUT);
    const submitButton = screen.getByTestId(TEST_IDS.SUBMIT_BUTTON);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(setAuthToken).toHaveBeenCalledWith("fake-token");
      expect(mockRouter.push).toHaveBeenCalledWith("/users");
    });
  });
});
