import { useCallback, useEffect, useRef, useState } from "react";
import { WS_BASE_URL, WS_RECONNECT_INTERVAL_MS } from "../constants/api";

const useWebSocket = (urlPath) => {
  const [status, setStatus] = useState("idle");
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);
  const reconnectRef = useRef(null);
  const shouldReconnectRef = useRef(true);

  const socketUrl =
    urlPath?.startsWith("ws://") || urlPath?.startsWith("wss://")
      ? urlPath
      : `${WS_BASE_URL}${urlPath || ""}`;

  const sendMessage = useCallback((message) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return false;
    }

    socketRef.current.send(message);
    return true;
  }, []);

  useEffect(() => {
    if (!socketUrl) return;
    shouldReconnectRef.current = true;

    const connect = () => {
      if (!shouldReconnectRef.current) return;

      setStatus("connecting");
      const socket = new WebSocket(socketUrl);
      socketRef.current = socket;

      socket.onopen = () => setStatus("open");
      socket.onmessage = (event) => setLastMessage(event.data);
      socket.onerror = () => setStatus("error");
      socket.onclose = () => {
        setStatus("closed");
        if (!shouldReconnectRef.current) return;
        reconnectRef.current = setTimeout(connect, WS_RECONNECT_INTERVAL_MS);
      };
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;

      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [socketUrl]);

  return {
    status,
    lastMessage,
    sendMessage,
  };
};

export default useWebSocket;
