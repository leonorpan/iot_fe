import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../test/test-utils";
import IoTSocketFilters from "./IoTSocketFilters";

describe("IoTSocketFilter", () => {
  it("renders without crashing", () => {
    renderWithProviders(<IoTSocketFilters />);
    expect(screen.getByTestId("iot-socket-filter")).toBeInTheDocument();
  });
});
