import { createContext, useContext, useEffect } from 'react';
import webSocketService from '../services/webSocketService';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const eventHandlers = {};

  useEffect(() => {
    // handle incoming WebSocket messages
    webSocketService.addMessageListener((message) => {
      const { event } = message;

      if (eventHandlers[event]) {
        eventHandlers[event].forEach((handler) => handler(message));
      }
    });

    // cleanup on unmount
    return () => {
      webSocketService.removeMessageListener();
    };
  }, []);

  const sendMessage = (message) => {
    webSocketService.sendMessage(message);
  };

  const addEventListener = (event, handler) => {
    if (!eventHandlers[event]) {
      eventHandlers[event] = [];
    }
    eventHandlers[event].push(handler);
  };

  return (
    <WebSocketContext.Provider value={{ addEventListener, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
