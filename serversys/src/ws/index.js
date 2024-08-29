const { WebSocketServer } = require('ws');
const si = require('systeminformation');

module.exports = function(server, app) {
    const wss = new WebSocketServer({ clientTracking: false, noServer: true });

    server.on('upgrade', function (request, socket, head) {
        socket.on('error', (error) => console.log(`Socket error: ${error}`));
      
        wss.handleUpgrade(request, socket, head, function (ws) {
          wss.emit('connection', ws, request);
        });
    });

    wss.on('connection', (ws) => {
        console.log(`Client connected: ${si.uuid()}`);
      
        const sendRamUsage = async () => {
          try {
            const memData = await si.mem();
            ws.send(JSON.stringify({ event: 'ram-usage', data: { used: (memData.active / (1024 ** 3)).toFixed(3), free: (memData.free / (1024 ** 3)).toFixed(3) } }));
          } catch (error) {
            console.error('Error fetching RAM data:', error);
          }
        };
      
        const sendProcesses = async () => {
          const test = await si.processes();
          const running = test.list.sort((a, b) => b.mem - a.mem).slice(0, 50);
          const data = running.map(s => ({ name: s.name, mem: (((app.locals.totalMem * s.mem) / 100) * 1024).toFixed(2), pid: s.pid })); // Convert memRss from kilobytes to MB
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