import { Server } from "socket.io";
import http from "node:http";
import express from "express";
import { CLIENT_URL } from "../constants/env";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
  },
});

export { io, app, server };
