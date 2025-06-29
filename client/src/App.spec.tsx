import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import App from "./App";
import useWebSocket from "./hooks/useWebSocket";
import { renderWithProviders } from "./test/test-utils";
import type { Sensor } from "./types";

vi.mock("./hooks/useWebSocket", () => ({
  default: vi.fn(() => ({
    sendMessage: vi.fn(),
    socketStatus: "open",
  })),
}));
vi.mock("./components/SensorCard", () => ({
  __esModule: true,
  default: ({ sensor }: { sensor: Sensor }) => (
    <div data-testid="sensor-card">{sensor.name}</div>
  ),
}));

describe("App basic UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dashboard title", () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId("app-title")).toBeInTheDocument();
  });

  it("shows connection status: Connected", () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId("connection-status")).toHaveTextContent(
      "Connected"
    );
  });

  it("shows connection status: Connecting", () => {
    (useWebSocket as Mock).mockReturnValueOnce({
      sendMessage: vi.fn(),
      socketStatus: "connecting",
    });
    renderWithProviders(<App />);
    expect(screen.getByTestId("connection-status")).toHaveTextContent(
      "Connecting to the server..."
    );
  });

  it("shows connection status: Disconnected", () => {
    (useWebSocket as Mock).mockReturnValueOnce({
      sendMessage: vi.fn(),
      socketStatus: "closed",
    });
    renderWithProviders(<App />);
    expect(screen.getByTestId("connection-status")).toHaveTextContent(
      "Disconnected. Attempting to reconnect"
    );
  });

  it("renders the connected sensors count", () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId("connection-status")).toHaveTextContent(
      "Connected to the server"
    );
    expect(screen.getByTestId("connected-sensors-count")).toHaveTextContent(
      "0"
    );
  });

  it("renders the toggle for connected sensors only", () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId("filter-toggle")).toBeInTheDocument();
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("shows 'No sensors found' message when no sensors", () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId("no-sensors")).toBeInTheDocument();
  });
});
