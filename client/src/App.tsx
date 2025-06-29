import { useCallback } from "react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import ConnectedSensorsCount from "./components/ConnectedSensorsCount";
import IoTDashboardHeader from "./components/IoTDashboardHeader";
import IoTSocketFilters from "./components/IoTSocketFilters";
import IoTSocketStatus from "./components/IoTSocketStatus";
import SensorsList from "./components/SensorsList";
import { SENSOR_WS_URL } from "./consts";
import useWebSocket from "./hooks/useWebSocket";
import { selectSensors, upsertSensor } from "./slices/sensors";
import { type Sensor } from "./types";

function App() {
  const dispatch = useDispatch();
  const sensorsList = useSelector(selectSensors);

  const handleWebSocketMessage = (incomingSensor: Sensor) => {
    dispatch(upsertSensor(incomingSensor));
  };

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
    () => sensorsList.filter((s) => s.connected).length,
    [sensorsList]
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 font-sans">
      <IoTDashboardHeader>IoT Dashboard</IoTDashboardHeader>

      <IoTSocketStatus status={socketStatus} />

      <IoTSocketFilters />

      <ConnectedSensorsCount>{connectedSensorsCount}</ConnectedSensorsCount>

      <SensorsList toggleSensorConnection={toggleSensorConnection} />
    </div>
  );
}

export default App;
