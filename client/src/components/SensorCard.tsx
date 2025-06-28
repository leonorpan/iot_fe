import { memo } from "react";

import { type Sensor } from "../types";

interface SensorCardProps {
  sensor: Sensor;
  onToggleConnection: (sensorId: string, isConnected: boolean) => void;
}

function SensorCard({ sensor, onToggleConnection }: SensorCardProps) {
  return (
    <div
      key={sensor.id}
      className={`p-6 rounded-lg shadow-md transition-all duration-300
        ${
          sensor.connected
            ? "bg-green-50 border-green-300"
            : "bg-red-50 border-red-300"
        }
        border-l-4`}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {sensor.name}
      </h2>
      <p className="text-gray-700" data-testid="sensor-id">
        <span className="font-medium">ID:</span> {sensor.id}
      </p>
      <p className="text-gray-700" data-testid="sensor-status">
        <span className="font-medium">Status:</span>{" "}
        <span
          className={`font-bold ${
            sensor.connected ? "text-green-600" : "text-red-600"
          }`}
        >
          {sensor.connected ? "Connected" : "Disconnected"}
        </span>
      </p>
      <p className="text-gray-700 mb-4" data-testid="sensor-value">
        <span className="font-medium">Value:</span>{" "}
        {sensor.value !== null ? `${sensor.value} ${sensor.unit}` : "N/A"}
      </p>
      <button
        onClick={() => onToggleConnection(sensor.id, sensor.connected)}
        className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-colors duration-200 hover:scale-105
          ${
            sensor.connected
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
      >
        {sensor.connected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}

export default memo(SensorCard);
