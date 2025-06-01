import { act,renderHook } from "@testing-library/react";
import { afterEach,beforeEach, describe, expect, it, vi } from "vitest";

import { type Sensor } from "../types";
import useWebSocket from "./useWebSocket";

class MockWebSocket {
  public onopen: ((event: Event) => void) | null = null;
  public onmessage: ((event: MessageEvent) => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;
  public onclose: ((event: CloseEvent) => void) | null = null;

  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  public readyState: number = WebSocket.CONNECTING;
  public url: string;
  static instance: MockWebSocket | null = null;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instance = this;
    setTimeout(() => {
      if (this.readyState === WebSocket.CONNECTING) {
        this.readyState = WebSocket.OPEN;
        this.onopen?.(new Event("open"));
      }
    }, 100);
  }

  send = vi.fn(() => {});

  close = vi.fn((code?: number, reason?: string) => {
    this.readyState = WebSocket.CLOSED;
    this.onclose?.(new CloseEvent("close", { code, reason }));
  });

  static triggerMessage(data: Sensor) {
    if (MockWebSocket.instance?.onmessage) {
      MockWebSocket.instance.onmessage(
        new MessageEvent("message", { data: JSON.stringify(data) })
      );
    }
  }

  static triggerError() {
    if (MockWebSocket.instance?.onerror) {
      MockWebSocket.instance.onerror(new Event("error"));
    }
  }

  static triggerClose(code: number = 1000, reason: string = "Normal Closure") {
    if (MockWebSocket.instance?.onclose) {
      MockWebSocket.instance.onclose(new CloseEvent("close", { code, reason }));
    }
  }
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.stubGlobal("WebSocket", MockWebSocket);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  MockWebSocket.instance = null;
});

describe("useWebSocket", () => {
  const MOCK_URL = "ws://localhost:5000";
  const mockOnMessage = vi.fn();
  const mockOnOpen = vi.fn();
  const mockOnError = vi.fn();
  const mockOnClose = vi.fn();

  it("should initialize and connect to the WebSocket", async () => {
    const { result } = renderHook(() =>
      useWebSocket({
        url: MOCK_URL,
        onMessage: mockOnMessage,
        onOpen: mockOnOpen,
        onError: mockOnError,
        onClose: mockOnClose,
      })
    );

    expect(result.current.readyState).toBe(WebSocket.CONNECTING);
    expect(MockWebSocket.instance).not.toBeNull();
    expect(MockWebSocket.instance).toBeInstanceOf(MockWebSocket);
    expect(MockWebSocket.instance?.url).toBe(MOCK_URL);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.readyState).toBe(WebSocket.OPEN);
    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  it("should receive messages and call onMessage callback", async () => {
    const { result } = renderHook(() =>
      useWebSocket({
        url: MOCK_URL,
        onMessage: mockOnMessage,
        onOpen: mockOnOpen,
        onError: mockOnError,
        onClose: mockOnClose,
      })
    );

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.readyState).toBe(WebSocket.OPEN);
    const sensorData = {
      id: "sensor1",
      name: "Temperature",
      value: "25.5",
      unit: "°C",
      connected: true,
    };
    await act(async () => {
      MockWebSocket.triggerMessage(sensorData);
    });

    expect(mockOnMessage).toHaveBeenCalledTimes(1);
    expect(mockOnMessage).toHaveBeenCalledWith(sensorData);
  });

  it("should send messages when the WebSocket is open", async () => {
    const { result } = renderHook(() =>
      useWebSocket({
        url: MOCK_URL,
        onMessage: mockOnMessage,
        onOpen: mockOnOpen,
        onError: mockOnError,
        onClose: mockOnClose,
      })
    );

    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.readyState).toBe(WebSocket.OPEN);
    const messageToSend = { command: "connect", id: "sensor-123" };
    act(() => {
      result.current.sendMessage(messageToSend);
    });

    expect(MockWebSocket.instance?.send).toHaveBeenCalledTimes(1);
    expect(MockWebSocket.instance?.send).toHaveBeenCalledWith(
      JSON.stringify(messageToSend)
    );
  });

  it("should not send messages when the WebSocket is not open", async () => {
    const { result } = renderHook(() =>
      useWebSocket({
        url: MOCK_URL,
        onMessage: mockOnMessage,
        onOpen: mockOnOpen,
        onError: mockOnError,
        onClose: mockOnClose,
      })
    );

    expect(MockWebSocket.instance?.send).not.toHaveBeenCalled();
    await act(async () => {
      MockWebSocket.triggerClose(1000, "Normal closure");
    });

    const messageToSend = { command: "connected", id: "sensor-456" };
    act(() => {
      result.current.sendMessage(messageToSend);
    });

    expect(MockWebSocket.instance?.send).not.toHaveBeenCalled();
  });

  it("should call onError callback when a WebSocket error occurs", async () => {
    const { result } = renderHook(() =>
      useWebSocket({
        url: MOCK_URL,
        onMessage: mockOnMessage,
        onOpen: mockOnOpen,
        onError: mockOnError,
        onClose: mockOnClose,
      })
    );

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.readyState).toBe(WebSocket.OPEN);
    await act(async () => {
      MockWebSocket.triggerError();
    });

    expect(mockOnError).toHaveBeenCalledTimes(1);
    expect(result.current.readyState).toBe(WebSocket.OPEN);
  });

  it("should close normally and not attempt reconnect on code 1000", async () => {
    const { result } = renderHook(() =>
      useWebSocket({
        url: MOCK_URL,
        onMessage: mockOnMessage,
        onOpen: mockOnOpen,
        onError: mockOnError,
        onClose: mockOnClose,
      })
    );

    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.readyState).toBe(WebSocket.OPEN);
    await act(async () => {
      MockWebSocket.triggerClose(1000, "Normal closure");
    });

    expect(result.current.readyState).toBe(WebSocket.CLOSED);
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.readyState).toBe(WebSocket.CLOSED);
    expect(MockWebSocket.instance?.url).toBe(MOCK_URL);
  });

  it("should attempt to reconnect on abnormal closure (e.g., code 1006)", async () => {
    const { result } = renderHook(() =>
      useWebSocket({
        url: MOCK_URL,
        onMessage: mockOnMessage,
        onOpen: mockOnOpen,
        onError: mockOnError,
        onClose: mockOnClose,
      })
    );

    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.readyState).toBe(WebSocket.OPEN);
    mockOnOpen.mockClear();
    mockOnClose.mockClear();
    const oldMockInstance = MockWebSocket.instance;

    await act(async () => {
      MockWebSocket.triggerClose(1006, "Abnormal closure");
    });

    expect(result.current.readyState).toBe(WebSocket.CLOSED);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledWith(
      expect.objectContaining({ code: 1006 })
    );

    await act(async () => {
      vi.advanceTimersByTime(3100);
    });

    expect(MockWebSocket.instance).not.toBeNull();
    expect(MockWebSocket.instance).not.toBe(oldMockInstance);
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.readyState).toBe(MockWebSocket.OPEN);
    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  it("should close the WebSocket connection on unmount", async () => {
    const { result, unmount } = renderHook(() =>
      useWebSocket({
        url: MOCK_URL,
        onMessage: mockOnMessage,
        onOpen: mockOnOpen,
        onError: mockOnError,
        onClose: mockOnClose,
      })
    );

    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.readyState).toBe(WebSocket.OPEN);

    const closeSpy = vi.spyOn(MockWebSocket.instance!, "close");

    act(() => {
      unmount();
    });

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledWith(
      1000,
      "Component unmounting or effect re-running"
    );
    expect(MockWebSocket.instance?.readyState).toBe(WebSocket.CLOSED);
  });
});
