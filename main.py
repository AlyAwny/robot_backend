from fastapi import FastAPI, WebSocket, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets
import logging

app = FastAPI()
security = HTTPBasic()

# Enable logging for better debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fastapi")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://robot-web-gui-git-master-aly-awnys-projects.vercel.app/"],  # Adjust this for production, such as ["https://your-frontend-url"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store credentials (in production, use environment variables or a DB)
VALID_USERNAME = "admin"
VALID_PASSWORD = "alyhanykhaledhatem"

# Authentication Dependency
def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    is_correct_username = secrets.compare_digest(credentials.username, VALID_USERNAME)
    is_correct_password = secrets.compare_digest(credentials.password, VALID_PASSWORD)
    if not (is_correct_username and is_correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# Robot State Variables
robot_position = {"x": 0, "y": 0}
battery_voltage = 12.5
robot_speed = 0.6
robot_state = "Idle"

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket connection established")
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"Received data from frontend: {data}")

            # Sending robot status updates
            await websocket.send_json({
                "position": robot_position,
                "battery": battery_voltage,
                "speed": robot_speed,
                "state": robot_state
            })
    except Exception as e:
        logger.error(f"Error in WebSocket connection: {e}")
        await websocket.close()

@app.get("/protected")
def read_protected(user: str = Depends(verify_credentials)):
    logger.info(f"User {user} is authenticated.")
    return {"message": f"Welcome {user}, you are authorized."}

@app.get("/robot_status")
def get_robot_status():
    """A simple endpoint to get robot status."""
    logger.info("Fetching robot status")
    return {
        "position": robot_position,
        "battery": battery_voltage,
        "speed": robot_speed,
        "state": robot_state
    }

@app.get("/error_test")
def error_test():
    """Testing error handling."""
    logger.info("Test error route triggered.")
    raise HTTPException(status_code=500, detail="Test error route triggered")
