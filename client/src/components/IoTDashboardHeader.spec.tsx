import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import IoTDashboardHeader from "./IoTDashboardHeader";

describe("IoTDashboardHeader", () => {
  it("renders the children inside an h1", () => {
    render(<IoTDashboardHeader>Dashboard Title</IoTDashboardHeader>);
    const heading = screen.getByTestId("app-title");
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
    expect(heading).toHaveTextContent("Dashboard Title");
  });

  it("applies the correct classes", () => {
    render(<IoTDashboardHeader>Header</IoTDashboardHeader>);
    const heading = screen.getByTestId("app-title");
    expect(heading).toHaveClass(
      "text-4xl",
      "font-bold",
      "text-gray-800",
      "mb-8"
    );
  });

  it("renders different children correctly", () => {
    render(<IoTDashboardHeader>Another Title</IoTDashboardHeader>);
    expect(screen.getByText("Another Title")).toBeInTheDocument();
  });
});
