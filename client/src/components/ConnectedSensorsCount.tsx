interface ConnectedSensorsCountProps {
  children: React.ReactNode;
}

function ConnectedSensorsCount({ children }: ConnectedSensorsCountProps) {
  return (
    <p className="text-gray-700 text-lg mb-8">
      Currently Connected:{" "}
      <span
        className="font-bold text-indigo-700"
        data-testid="connected-sensors-count"
      >
        {children}
      </span>
    </p>
  );
}

export default ConnectedSensorsCount;
