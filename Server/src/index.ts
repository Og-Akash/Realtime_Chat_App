import express from "express";
import "dotenv/config";
import { connectDb } from "./config/db";
import { PORT, CLIENT_URL } from "./constants/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware";
import routes from "./routes/index.route";
import { app, server } from "./utils/socket";

const port = PORT || 3000;

//? middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

//? all of our api routes
app.use("/api", routes);

//? error handling middleware
app.use(errorHandler);

//? start the server
server.listen(port, async () => {
  console.log(`server is listening on ${port}`);
  await connectDb();
});
