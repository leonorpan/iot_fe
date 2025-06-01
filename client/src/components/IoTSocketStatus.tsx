type SocketStatus = "open" | "connecting" | "closed" | "closing";

const socketStatusMessages = {
  connecting: "Connecting to the server...",
  open: "Connected to the server.",
  closed: "Disconnected. Attempting to reconnect...",
  closing: "Closing the connection...",
};

interface IoTSocketStatusProps {
  status: SocketStatus;
}

function IoTSocketStatus({ status }: IoTSocketStatusProps) {
  return (
    <div
      className="mb-4 p-2 rounded-md font-semibold text-center w-full max-w-sm
      bg-blue-100 text-blue-800 border border-blue-300"
      data-testid="connection-status"
    >
      <span className="text-blue-600">{socketStatusMessages[status]}</span>
    </div>
  );
}

export default IoTSocketStatus;
