import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import useWebSocket from "./hooks/useWebSocket";
import type { Sensor } from "./types";

vi.mock("./hooks/useWebSocket", () => ({
  default: vi.fn(() => ({
    sendMessage: vi.fn(),
    readyState: 1,
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
    render(<App />);
    expect(screen.getByTestId("app-title")).toBeInTheDocument();
  });

  it("shows connection status: Connected", () => {
    render(<App />);
    expect(screen.getByTestId("connection-status")).toHaveTextContent(
      "Connected"
    );
  });

  it("shows connection status: Connecting", () => {
    (useWebSocket as Mock).mockReturnValueOnce({
      sendMessage: vi.fn(),
      readyState: WebSocket.CONNECTING,
    });
    render(<App />);
    expect(screen.getByTestId("connection-status")).toHaveTextContent(
      "Connecting to server..."
    );
  });

  it("shows connection status: Disconnected", () => {
    (useWebSocket as Mock).mockReturnValueOnce({
      sendMessage: vi.fn(),
      readyState: WebSocket.CLOSED,
    });
    render(<App />);
    expect(screen.getByTestId("connection-status")).toHaveTextContent(
      "Disconnected. Attempting reconnect"
    );
  });

  it("renders the connected sensors count", () => {
    render(<App />);
    expect(screen.getByTestId("connection-status")).toHaveTextContent(
      "Connected to server"
    );
    expect(screen.getByTestId("connected-sensors-count")).toHaveTextContent(
      "0"
    );
  });

  it("renders the toggle for connected sensors only", () => {
    render(<App />);
    expect(screen.getByTestId("filter-toggle")).toBeInTheDocument();
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("shows 'No sensors found' message when no sensors", () => {
    render(<App />);
    expect(screen.getByTestId("no-sensors")).toBeInTheDocument();
  });
});
