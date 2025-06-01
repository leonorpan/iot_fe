import { useCallback, useState } from "react";
import { useMemo } from "react";

import ConnectedSensorsCount from "./components/ConnectedSensorsCount";
import IoTDashboardHeader from "./components/IoTDashboardHeader";
import IoTSocketFilters from "./components/IoTSocketFilters";
import IoTSocketStatus from "./components/IoTSocketStatus";
import SensorsList from "./components/SensorsList";
import { SENSOR_WS_URL } from "./consts";
import useWebSocket from "./hooks/useWebSocket";
import { type Sensor } from "./types";

function App() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [showConnectedOnly, setShowConnectedOnly] = useState(false);

  const handleWebSocketMessage = useCallback((incomingSensor: Sensor) => {
    setSensors((prev) =>
      // Check if the sensor already exists in the array
      prev.some((s) => s.id === incomingSensor.id)
        ? // If it exists, replace it with the incoming sensor
          prev.map((s) => (s.id === incomingSensor.id ? incomingSensor : s))
        : // If not, add the incoming sensor to the array
          [...prev, incomingSensor]
    );
  }, []);

  const onWsOpen = useCallback(() => {
    console.info("App: WebSocket connected via hook");
  }, []);
  const onWsError = useCallback((event: Event) => {
    console.error("App: WebSocket error via hook:", event);
  }, []);
  const onWsClose = useCallback(() => {
    console.info("App: WebSocket closed via hook");
  }, []);

  const { sendMessage, socketStatus } = useWebSocket<Sensor>({
    url: SENSOR_WS_URL,
    onMessage: handleWebSocketMessage,
    onOpen: onWsOpen,
    onError: onWsError,
    onClose: onWsClose,
  });

  const toggleSensorConnection = useCallback(
    (sensorId: string, isConnected: boolean) => {
      const command = isConnected ? "disconnect" : "connect";
      const message = { command, id: sensorId };
      sendMessage(message);
      console.info(`Sent command: ${command} for sensor ID: ${sensorId}`);
    },
    [sendMessage]
  );

  const connectedSensorsCount = useMemo(
    () => sensors.filter((s) => s.connected).length,
    [sensors]
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 font-sans">
      <IoTDashboardHeader>IoT Dashboard</IoTDashboardHeader>

      <IoTSocketStatus status={socketStatus} />

      <IoTSocketFilters
        showConnectedOnly={showConnectedOnly}
        setShowConnectedOnly={setShowConnectedOnly}
      />

      <ConnectedSensorsCount>{connectedSensorsCount}</ConnectedSensorsCount>

      <SensorsList
        showConnectedOnly={showConnectedOnly}
        sensors={sensors}
        toggleSensorConnection={toggleSensorConnection}
      />
    </div>
  );
}

export default App;
