import { Ref, useCallback, useEffect, useRef, useState } from "react";

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

type IoTSocketStatus = "connecting" | "open" | "closed" | "closing";

function useWebSocket<T>(options: UseWebSocketOptions<T>) {
  const wsRef = useRef<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);

  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const timeoutId: Ref<number | null> = useRef(null);

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
      return;
    }

    const ws = new WebSocket(options.url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.info("WebSocket connection opened (from ws.onopen callback)");
      setReadyState(WebSocket.OPEN);
      options.onOpen?.();
    };

    ws.onmessage = (event) => {
      const data: T = JSON.parse(event.data);
      options.onMessage(data);
    };

    ws.onerror = (event: Event) => {
      console.error("WebSocket error (from ws.onerror callback):", event);
      // setReadyState(WebSocket.OPEN);
      options.onError?.(event);
    };

    ws.onclose = (event: CloseEvent) => {
      console.info("WebSocket connection closed (from ws.onclose callback)");
      setReadyState(WebSocket.CLOSED);
      options.onClose?.(event);

      if (event.code !== 1000 && event.code !== 1001) {
        // 1000 is normal closure, 1001 is browser closing tab
        console.info(
          `Abnormal WebSocket closure. Code: ${event.code}. Attempting to reconnect...`
        );
        if (timeoutId.current) clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => {
          console.info("Attempting to reconnect...");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.url, reconnectAttempt]);

  const getSocketStatus = (state: number): IoTSocketStatus => {
    switch (state) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "open";
      case WebSocket.CLOSED:
        return "closed";
      default:
        return "closing";
    }
  };

  return { sendMessage, socketStatus: getSocketStatus(readyState) };
}

export default useWebSocket;
