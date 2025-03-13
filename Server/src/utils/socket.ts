import { Server } from "socket.io";
import http from "node:http";
import express from "express";
import { CLIENT_URL } from "../constants/env";
import userModel from "../models/user.model";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
  },
});

export function getSocketId(userId: string): string {
  return userSocketMap[userId];
}

//* Use to store online users into the applicaton
const userSocketMap: Record<string, string> = {}; //! --> { userId: socketId}

io.on("connection", (socket) => {
  console.log(`user Joined with socket id ${socket.id}`);

  const userId = socket.handshake.query.userId as string;

  if (userId) userSocketMap[userId] = socket.id;

  //? This io.emit used to send any event to all the connected users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", async () => {
    console.log(`user disconnected with socket id ${socket.id}`);
    delete userSocketMap[userId];

    await userModel.findByIdAndUpdate(userId, {
      lastSeen: new Date(),
    })

    io.emit("user:last-seen", {userId, lastSeen: new Date()})
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
