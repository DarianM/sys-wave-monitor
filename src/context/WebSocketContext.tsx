import { createContext, useContext, useEffect } from 'react';
import webSocketService from '../services/webSocketService';
import { MessageData } from '../interfaces/types';

interface WebSocketContextValue {
  addEventListener: (event: string, handler: (message: MessageData) => void) => void;
  sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const WebSocketProvider = ({ children }) => {
  const eventHandlers: { [event: string]: ((message: MessageData) => void)[] } = {};

  useEffect(() => {
    // handle incoming WebSocket messages
    webSocketService.addMessageListener((message: MessageData) => {
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

  const sendMessage = (message: string) => {
    webSocketService.sendMessage(message);
  };

  const addEventListener = (event: string, handler: (message: MessageData) => void) => {
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
