import { useState, useCallback } from "react";
import useWebSocket from "./hooks/useWebSocket";
import SensorCard from "./components/SensorCard";
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

  const { sendMessage } = useWebSocket<Sensor>({
    url: "ws://localhost:5000",
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
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        IoT Sensor Dashboard
      </h1>

      <div className="mb-8 p-4 bg-white rounded-lg shadow-md flex items-center space-x-4">
        <label
          htmlFor="showConnectedToggle"
          className="text-gray-700 font-medium text-lg"
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
        <span className="font-bold text-indigo-700">
          {connectedSensorsCount}
        </span>
      </p>

      {sensors.length === 0 ? (
        <p className="text-gray-600 text-lg">
          Connecting to sensors... make sure your backend server is running!
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
