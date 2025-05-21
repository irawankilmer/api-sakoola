import { Server } from "socket.io";
import { corsOptions } from "../configs/corsConfig.js";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { 
      origin: corsOptions.origin,
      credentials: corsOptions.credentials,
      methods: ["GET", "POST"],
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected: ', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected: ', socket.id);
    });
  });
}

export function getIO() {
  return io;
}