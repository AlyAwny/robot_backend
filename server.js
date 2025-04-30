const http = require("http");
const app = require("./app");
const setupWebSocket = require("./config/websocket");
 
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
 
// Attach WebSocket
setupWebSocket(server);
 
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});