import { useMemo } from "react";

import { Sensor } from "../types";
import SensorCard from "./SensorCard";

interface SensorsListProps {
  sensors: Sensor[];
  showConnectedOnly?: boolean;
  toggleSensorConnection: (sensorId: string, isConnected: boolean) => void;
}

function SensorsList({
  sensors,
  showConnectedOnly,
  toggleSensorConnection,
}: SensorsListProps) {
  const filteredSensors = useMemo(
    () =>
      sensors.filter((sensor) => (showConnectedOnly ? sensor.connected : true)),
    [sensors, showConnectedOnly]
  );

  return filteredSensors.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
      {filteredSensors.map((sensor: Sensor) => (
        <SensorCard
          key={sensor.id}
          sensor={sensor}
          onToggleConnection={() =>
            toggleSensorConnection(sensor.id, sensor.connected)
          }
        />
      ))}
    </div>
  ) : (
    <p className="text-gray-600 text-lg" data-testid="no-sensors">
      No sensors found. Waiting for data...
    </p>
  );
}

export default SensorsList;
