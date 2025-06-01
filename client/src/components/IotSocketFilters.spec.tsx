import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import IoTSocketFilters from "./IoTSocketFilters";

describe("IoTSocketFilter", () => {
  it("renders without crashing", () => {
    render(
      <IoTSocketFilters
        showConnectedOnly={false}
        setShowConnectedOnly={vi.fn()}
      />
    );
    // You can check for a known element or text
    expect(screen.getByTestId("iot-socket-filter")).toBeInTheDocument();
  });

  it("calls onChange when filter changes", async () => {
    const handleChange = vi.fn();
    render(
      <IoTSocketFilters
        setShowConnectedOnly={handleChange}
        showConnectedOnly={false}
      />
    );
    const input = screen.getByTestId("iot-filter-input");
    await fireEvent.click(input);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
