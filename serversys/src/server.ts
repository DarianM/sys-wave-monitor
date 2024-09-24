import http from 'http';
import app from './app';
import initWebSocket from './ws/socket';

// create an HTTP server.
const server = http.createServer(app);

// create a WebSocket server completely detached from the HTTP server.
initWebSocket(server, app);

const PORT = process.env.PORT || 8080;

server.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}...`);
});
