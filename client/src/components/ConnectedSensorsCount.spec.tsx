import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ConnectedSensorsCount from "./ConnectedSensorsCount";

describe("ConnectedSensorsCount", () => {
  it("displays the correct count", () => {
    render(<ConnectedSensorsCount>5</ConnectedSensorsCount>);
    const countElement = screen.getByTestId("connected-sensors-count");
    expect(countElement).toBeInTheDocument();
    expect(countElement).toHaveTextContent("5");
  });
});
