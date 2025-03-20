import express, { Request, Response } from "express";
import "dotenv/config";
import { connectDb } from "./config/db";
import { PORT, CLIENT_URL } from "./constants/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware";
import routes from "./routes/index.route";
import { OK } from "./constants/http";
import { app, server } from "./utils/socket";
import path from "node:path";

const port = PORT || 3000;
const __dirname = path.resolve();

//? middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

//? health route
app.get("/", async (req: Request, res: Response) => {
  res.status(OK).json({
    status: "healthy",
  });
});

//? all of our api routes
app.use("/api", routes);

//? error handling middleware
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

//? start the server
server.listen(port, async () => {
  console.log(`server is listening on ${port}`);
  await connectDb();
});
