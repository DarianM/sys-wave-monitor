import { WebSocketServer } from 'ws';
import si from 'systeminformation';
import { Express } from 'express';
import { Server } from 'http';

export default function(server: Server, app: Express) {
    const wss = new WebSocketServer({ clientTracking: false, noServer: true });

    server.on('upgrade', function (request, socket, head) {
        socket.on('error', (error) => console.log(`Socket error: ${error}`));
      
        wss.handleUpgrade(request, socket, head, function (ws) {
          wss.emit('connection', ws, request);
        });
    });

    wss.on('connection', async (ws) => {
      const test = await si.uuid();
      console.log(`Client connected: ${test.hardware}`);
      
      const sendRamUsage = async () => {
        try {
          const memData = await si.mem();
          ws.send(JSON.stringify({ event: 'ram-usage', data: { used: (memData.active / (1024 ** 3)).toFixed(3), free: (memData.free / (1024 ** 3)).toFixed(3) } }));
        } catch (error) {
          console.error('Error fetching RAM data:', error);
        }
      };
      
      const sendProcesses = async () => {
        const processes = await si.processes();
        const running = processes.list.sort((a, b) => b.memRss - a.memRss).slice(0, 50);
        const data = running.map(s => ({ name: s.name, mem: ((s.memRss) / 1024).toFixed(2), pid: s.pid })); // Convert memRss from kilobytes to MB
        ws.send(JSON.stringify({ event: 'processes', data }));
      };
    
      ws.on('message', async (message) => {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.event === 'get-ram-usage') {
          sendRamUsage();
        }
        if (parsedMessage.event === 'get-processes') {
          sendProcesses();
        }
      });
    
      ws.on('close', () => {
        console.log('Client disconnected');
      });
    
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
}