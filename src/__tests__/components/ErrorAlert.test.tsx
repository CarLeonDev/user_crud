import { render, screen } from "@testing-library/react";
import { ErrorAlert } from "@/components/ErrorAlert";
import Provider from "@/app/provider";

describe("ErrorAlert", () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(component, { wrapper: Provider });
  };

  it("should not render when there is no error", () => {
    renderWithProvider(<ErrorAlert error={null} title="Test Error" />);
    expect(screen.queryByText("Test Error")).not.toBeInTheDocument();
  });

  it("should render with error message", () => {
    const testError = new Error("Test error message");
    renderWithProvider(
      <ErrorAlert
        error={testError}
        title="Test Error"
        description="Test description"
      />
    );

    expect(screen.getByText("Test Error")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });
});
