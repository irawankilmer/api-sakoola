import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { 
      origin: 'http://localhost:3000' 
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