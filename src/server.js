import app from './app.js';
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./sockets/io.js";

dotenv.config();

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.APP_PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});