import { useEffect, useRef, useCallback, useState } from "react";

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
  const wsRef = useRef<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

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
    let timeoutId: number | null = null;
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
      setReadyState(WebSocket.OPEN);
      onOpen?.();
    };

    ws.onmessage = (event) => {
      const data: T = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = (event: Event) => {
      console.error("WebSocket error (from ws.onerror callback):", event);
      // setReadyState(WebSocket.OPEN);
      onError?.(event);
    };

    ws.onclose = (event: CloseEvent) => {
      console.log("WebSocket connection closed (from ws.onclose callback)");
      setReadyState(WebSocket.CLOSED);
      onClose?.(event);

      if (event.code !== 1000 && event.code !== 1001) {
        // 1000 is normal closure, 1001 is browser closing tab
        console.log(
          `Abnormal WebSocket closure. Code: ${event.code}. Attempting to reconnect...`
        );
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          console.log("Attempting to reconnect...");
          setReconnectAttempt((prev) => prev + 1);
        }, 3000);
      }
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
  }, [url, onMessage, onOpen, onError, onClose, reconnectAttempt]);

  return { sendMessage, readyState };
}

export default useWebSocket;
