const WebSocket = require("ws");
const { robot_position, battery_voltage, robot_speed, robot_state } = require("../routes/robot.routes");
 
function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });
 
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected.");
 
    ws.on("message", (message) => {
      console.log("Received from frontend:", message.toString());
 
      const status = {
        position: robot_position,
        battery: battery_voltage,
        speed: robot_speed,
        state: robot_state,
      };
      ws.send(JSON.stringify(status));
    });
 
    ws.on("close", () => {
      console.log("WebSocket client disconnected.");
    });
  });
 
  return wss;
}
 
module.exports = setupWebSocket;
