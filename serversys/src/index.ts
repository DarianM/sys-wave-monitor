import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import http from 'http';
import * as si from 'systeminformation';

const app = express();
// enabling CORS for some specific origins only. 
let corsOptions = { 
  origin : ['http://localhost:5173'], 
} 

// Use CORS middleware
app.use(cors(corsOptions));

// sample api routes for testing 
app.get('/',(req, res) => { 
  res.json("working") 
});

// Route to get total RAM memory
app.get('/total', async (req, res) => {
  try {
    const { total } = await si.mem();
    const totalMem = (total / (1024 ** 3)).toFixed(2)
    app.locals.totalMem = totalMem;
    res.json({ totalMem });
  } catch (error) {
    console.error('Error fetching total RAM data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Create an HTTP server.
const server = http.createServer(app);
// Create a WebSocket server completely detached from the HTTP server.
const wss = new WebSocketServer({ clientTracking: false, noServer: true });

server.on('upgrade', function (request, socket, head) {
  socket.on('error', (error) => console.log(`Socket error: ${error}`));

  wss.handleUpgrade(request, socket, head, function (ws) {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (ws) => {
  console.log(`Client connected: ${si.uuid()}`);

  // Function to send RAM usage data to the client
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
    // Sort processes by memory usage
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

  // Cleanup when client disconnects
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

//
// Start the server.
//
const port = 8080;
server.listen(port, function () {
  console.log('Listening on http://localhost:8080');
});
