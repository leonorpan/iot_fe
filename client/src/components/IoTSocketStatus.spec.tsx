import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import IoTSocketStatus from "./IoTSocketStatus";

describe("IoTSocketStatus", () => {
  const statuses = [
    { status: "connecting", message: "Connecting to the server..." },
    { status: "open", message: "Connected to the server." },
    { status: "closed", message: "Disconnected. Attempting to reconnect..." },
    { status: "closing", message: "Closing the connection..." },
  ] as const;

  statuses.forEach(({ status, message }) => {
    it(`renders correct message for status "${status}"`, () => {
      render(<IoTSocketStatus status={status} />);
      const statusDiv = screen.getByTestId("connection-status");
      expect(statusDiv).toBeInTheDocument();
      expect(statusDiv).toHaveTextContent(message);
    });
  });
});
