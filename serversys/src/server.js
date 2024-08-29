const http = require('http');
const app = require('./app');
const initWebSocket = require('./ws');

// create an HTTP server.
const server = http.createServer(app);

// create a WebSocket server completely detached from the HTTP server.
initWebSocket(server, app);

const PORT = process.env.PORT || 8080;

server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
});
