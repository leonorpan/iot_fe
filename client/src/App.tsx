import { useState, useCallback } from "react";
import useWebSocket from "./hooks/useWebSocket";
import SensorCard from "./components/SensorCard";
import { SENSOR_WS_URL } from "./consts";
import { type Sensor } from "./types";

function App() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [showConnectedOnly, setShowConnectedOnly] = useState(false);

  const handleWebSocketMessage = useCallback((incomingSensor: Sensor) => {
    setSensors((prevSensors) => {
      const existingSensorIndex = prevSensors.findIndex(
        (s) => s.id === incomingSensor.id
      );

      if (existingSensorIndex > -1) {
        const updatedSensors = [...prevSensors];
        updatedSensors[existingSensorIndex] = incomingSensor;
        return updatedSensors;
      } else {
        return [...prevSensors, incomingSensor];
      }
    });
  }, []);

  const onWsOpen = useCallback(
    () => console.log("App: WebSocket connected via hook"),
    []
  );
  const onWsError = useCallback(
    (event: Event) => console.error("App: WebSocket error via hook:", event),
    []
  );
  const onWsClose = useCallback(
    () => console.log("App: WebSocket closed via hook"),
    []
  );

  const { sendMessage, readyState } = useWebSocket<Sensor>({
    url: SENSOR_WS_URL,
    onMessage: handleWebSocketMessage,
    onOpen: onWsOpen,
    onError: onWsError,
    onClose: onWsClose,
  });

  const isConnecting = readyState === WebSocket.CONNECTING;
  const isConnected = readyState === WebSocket.OPEN;
  const isClosed = readyState === WebSocket.CLOSED;

  const toggleSensorConnection = useCallback(
    (sensorId: string, isConnected: boolean) => {
      const command = isConnected ? "disconnect" : "connect";
      const message = { command, id: sensorId };
      sendMessage(message);
      console.log(`Sent command: ${command} for sensor ID: ${sensorId}`);
    },
    [sendMessage]
  );

  const filteredSensors = sensors.filter((sensor) =>
    showConnectedOnly ? sensor.connected : true
  );

  const connectedSensorsCount = sensors.filter((s) => s.connected).length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 font-sans">
      <h1
        className="text-4xl font-bold text-gray-800 mb-8"
        data-testid="app-title"
      >
        IoT Sensor Dashboard
      </h1>

      <div
        className="mb-4 p-2 rounded-md font-semibold text-center w-full max-w-sm
        bg-blue-100 text-blue-800 border border-blue-300"
        data-testid="connection-status"
      >
        {isConnecting && (
          <span className="text-blue-600">Connecting to server...</span>
        )}
        {isConnected && (
          <span className="text-green-600">Connected to server.</span>
        )}
        {isClosed && (
          <span className="text-red-600">
            Disconnected. Attempting reconnect...
          </span>
        )}
      </div>

      <div className="mb-8 p-4 bg-white rounded-lg shadow-md flex items-center space-x-4">
        <label
          htmlFor="showConnectedToggle"
          className="text-gray-700 font-medium text-lg"
          data-testid="filter-toggle"
        >
          Show Connected Sensors Only:
        </label>
        <input
          type="checkbox"
          id="showConnectedToggle"
          checked={showConnectedOnly}
          onChange={(e) => setShowConnectedOnly(e.target.checked)}
          className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
        />
      </div>

      <p className="text-gray-700 text-lg mb-8">
        Currently Connected:{" "}
        <span
          className="font-bold text-indigo-700"
          data-testid="connected-sensors-count"
        >
          {connectedSensorsCount}
        </span>
      </p>

      {!isConnected && isClosed ? (
        <p className="text-gray-600 text-lg">
          WebSocket is disconnected. Please ensure backend is running.
        </p>
      ) : isConnecting ? (
        <p className="text-gray-600 text-lg">
          Establishing connection to backend...
        </p>
      ) : sensors.length === 0 ? (
        <p className="text-gray-600 text-lg" data-testid="no-sensors">
          <span>{JSON.stringify(sensors)}</span>
          No sensors found. Waiting for data...
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          {filteredSensors.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              onToggleConnection={toggleSensorConnection}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
