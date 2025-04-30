const express = require("express");
const router = express.Router();
 
let robot_position = { x: 0, y: 0 };
let battery_voltage = 12.5;
let robot_speed = 0.6;
let robot_state = "Idle";
 
// Protected endpoint
router.get("/protected", (req, res) => {
  const user = req.auth.user;
  console.log(`User ${user} is authenticated.`);
  res.json({ message: `Welcome ${user}, you are authorized.` });
});
 
// Robot status endpoint
router.get("/status", (req, res) => {
  console.log("Fetching robot status");
  res.json({
    position: robot_position,
    battery: battery_voltage,
    speed: robot_speed,
    state: robot_state,
  });
});
 
// Error route
router.get("/error_test", (req, res) => {
  console.log("Test error route triggered.");
  res.status(500).json({ detail: "Test error route triggered" });
});
 
module.exports = router;
 
// Export robot state for WebSocket usage
module.exports.robotState = {
  robot_position,
  battery_voltage,
  robot_speed,
  robot_state,
}