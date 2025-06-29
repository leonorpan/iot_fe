import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../store";
import { Sensor } from "../types";
import SensorCard from "./SensorCard";

interface SensorsListProps {
  toggleSensorConnection: (sensorId: string, isConnected: boolean) => void;
}

function SensorsList({ toggleSensorConnection }: SensorsListProps) {
  const sensors = useSelector((state: RootState) => state.sensors.sensors);
  const showConnectedOnly = useSelector(
    (state: RootState) => state.sensors.showConnectedOnly
  );
  const filteredSensors = useMemo(
    () =>
      sensors.filter((sensor) => (showConnectedOnly ? sensor.connected : true)),
    [sensors, showConnectedOnly]
  );

  const handleToggleSensorConnection = useCallback(
    (sensorId: string, connected: boolean) => {
      console.warn("handleToggleSensorConnection is not implemented");
      toggleSensorConnection(sensorId, connected);
    },
    [toggleSensorConnection]
  );

  return filteredSensors.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 py-4">
      {filteredSensors.map((sensor: Sensor) => (
        <SensorCard
          key={sensor.id}
          sensor={sensor}
          onToggleConnection={handleToggleSensorConnection}
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
