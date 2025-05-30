import { useEffect, useRef, useCallback } from "react";

interface WebSocketMessage {
  command: string;
  id: string;
}

interface UseWebSocketOptions<T> {
  url: string;
  onMessage: (data: T) => void;
  onOpen?: () => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
}

function useWebSocket<T>(options: UseWebSocketOptions<T>) {
  const { url, onMessage, onOpen, onError, onClose } = options;
  const wsRef = useRef<WebSocket | null>(null); // Use a distinct ref name

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn(
        "WebSocket is not open. Cannot send message:",
        message,
        "Current readyState:",
        wsRef.current?.readyState
      );
    }
  }, []);

  useEffect(() => {
    if (wsRef.current) {
      if (
        wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING
      ) {
        wsRef.current.close(1000, "Effect cleanup before new connection");
        console.log("Existing WebSocket closed before new one was created.");
      }
      wsRef.current = null;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection opened (from ws.onopen callback)");
      onOpen?.();
    };

    ws.onmessage = (event) => {
      const data: T = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = (event) => {
      console.error("WebSocket error (from ws.onerror callback):", event);
      onError?.(event);
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed (from ws.onclose callback)");
      onClose?.(event);
    };

    return () => {
      if (wsRef.current) {
        if (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        ) {
          wsRef.current.close(
            1000,
            "Component unmounting or effect re-running"
          );
          console.log("WebSocket connection closed during cleanup.");
        }
        wsRef.current = null;
      }
    };
  }, [url, onMessage, onOpen, onError, onClose]);

  return { sendMessage };
}

export default useWebSocket;
