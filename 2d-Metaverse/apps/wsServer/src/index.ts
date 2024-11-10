import { WebSocketServer, WebSocket } from "ws";
import { ClientMessage, ServerMessage } from "./types";
const wss = new WebSocketServer({ port: 3001 });

const spaces: Map<string, Set<WebSocket>> = new Map();
const userPositions: Map<WebSocket, { x: number; y: number }> = new Map();

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString()) as ClientMessage;
    handleClientMessage(ws, message);
  });

  ws.on("close", () => handleClientDisconnect(ws));
});

function handleClientMessage(ws: WebSocket, message: ClientMessage) {
  switch (message.type) {
    case "join":
      handleJoinEvent(ws, message.payload);
      break;
    case "move":
      handleMovementEvent(ws, message.payload);
      break;
    default:
      console.log("Unhandled event type:");
  }
}

function sendMessage(ws: WebSocket, message: ServerMessage) {
  ws.send(JSON.stringify(message));
}

function handleJoinEvent(ws: WebSocket, payload: { spaceId: string; token: string }) {
  const { spaceId } = payload;
    
  if (!spaces.has(spaceId)) {
    spaces.set(spaceId, new Set());
  }
  
  const space = spaces.get(spaceId)!;
  space.add(ws);
  
  const spawnPosition = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };
  userPositions.set(ws, spawnPosition);

  sendMessage(ws, {
    type: "space-joined",
    payload: {
      spawn: spawnPosition,
      users: Array.from(space).map((userWs) => ({ id: getUserId(userWs) }))
    }
  });
  
  space.forEach((client) => {
    if (client !== ws) {
      sendMessage(client, {
        type: "user-join",
        payload: { userId: getUserId(ws), ...spawnPosition }
      });
    }
  });
}

function getUserId(ws: WebSocket): string {
  const socket = (ws as any)._socket;
  return socket.remoteAddress + ":" + socket.remotePort;
}

function handleMovementEvent(ws: WebSocket, payload: { x: number; y: number }) {
  const currentPos = userPositions.get(ws);
  if (!currentPos) return;
  
  const canMove = checkCollision(payload.x, payload.y);
  if (canMove) {
    userPositions.set(ws, { x: payload.x, y: payload.y });
    broadcastToSpace(ws, {
      type: "movement",
      payload: { x: payload.x, y: payload.y, userId: getUserId(ws) }
    });
  } else {
    sendMessage(ws, {
      type: "movement-rejected",
      payload: { x: currentPos.x, y: currentPos.y }
    });
  }
}

function checkCollision(x: number, y: number): boolean {
  return true;
}

function handleClientDisconnect(ws: WebSocket) {
  userPositions.delete(ws);
  
  spaces.forEach((clients, spaceId) => {
    if (clients.has(ws)) {
      clients.delete(ws);
      clients.forEach((client) => {
        sendMessage(client, {
          type: "user-left",
          payload: { userId: getUserId(ws) }
        });
      });
    }
  });

  console.log("Client disconnected");
}

function broadcastToSpace(ws: WebSocket, message: ServerMessage) {
  const spaceId = Array.from(spaces.keys()).find((id) => spaces.get(id)?.has(ws));
  if (spaceId) {
    spaces.get(spaceId)!.forEach((client) => {
      if (client !== ws) {
        sendMessage(client, message);
      }
    });
  }
}
