import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SensorCard from "./SensorCard";
import { type Sensor } from "../types";

const mockSensor: Sensor = {
  id: "sensor-1",
  name: "Temperature Sensor",
  connected: true,
  value: "23.5",
  unit: "°C",
};

describe("SensorCard", () => {
  it("renders sensor details correctly", () => {
    render(<SensorCard sensor={mockSensor} onToggleConnection={vi.fn()} />);
    expect(screen.getByText("Temperature Sensor")).toBeInTheDocument();
    expect(screen.getByTestId("sensor-id")).toHaveTextContent("ID: sensor-1");
    expect(screen.getByTestId("sensor-status")).toBeInTheDocument();
    expect(screen.getByTestId("sensor-value")).toHaveTextContent(
      "Value: 23.5 °C"
    );
  });

  it("shows 'Disconnect' button when connected", () => {
    render(<SensorCard sensor={mockSensor} onToggleConnection={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveTextContent("Disconnect");
  });

  it("shows 'Connect' button when disconnected", () => {
    render(
      <SensorCard
        sensor={{ ...mockSensor, connected: false }}
        onToggleConnection={vi.fn()}
      />
    );
    expect(screen.getByRole("button")).toHaveTextContent("Connect");
  });

  it("calls onToggleConnection when button is clicked", () => {
    const onToggleConnection = vi.fn();
    render(
      <SensorCard sensor={mockSensor} onToggleConnection={onToggleConnection} />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onToggleConnection).toHaveBeenCalledWith("sensor-1", true);
  });
});
