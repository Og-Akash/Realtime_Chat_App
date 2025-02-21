import dotenv from "dotenv";
import { Response, Request } from "express-serve-static-core";
import express from "express";
import router from "./routes/index.route";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware";
import { connectDb } from "./utils/db.connect";

dotenv.config();

console.log(__dirname);

const app = express();
const port = process.env.PORT || 3000;

//? Middlewares
app.use(helmet());
app.use(express.static(path.join(__dirname, "uploads")));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (request: Request, response: Response) => {
  const data = request.body;
  console.log(data);

  response.status(200).json({
    status: "success",
    message: "Hello Into Our Chat App Api Site",
  });
});

app.use("/api", router);

app.use(errorHandler);

connectDb();
app.listen(port, () => {
  console.log("Server running on port: " + port);
});
