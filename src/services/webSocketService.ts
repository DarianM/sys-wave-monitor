class WebSocketService {
  // hold a reference to the singleton
  private static instance: WebSocketService | null = null;
  private ws: WebSocket | null = null;
  private readonly defaultInterval = 1000;

  // make the constructor private to prevent creating multiple instances
  // outside the class
  private constructor() {
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      this.triggerSysEvents();
    };
    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /** trigger system events every interval
   * if dif interval is needed, move send event to it's each respective component
   */
  triggerSysEvents() {
    setInterval(() => {
      this.sendMessage({ event: 'get-ram-usage' });
      this.sendMessage({ event: 'get-processes' });
  }, this.defaultInterval);
  }

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }

  addMessageListener(callback) {
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
  }

  removeMessageListener() {
    this.ws.onmessage = null;
  }
}

export default WebSocketService.getInstance();
  