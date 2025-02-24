import express, { Request, Response } from "express";
import "dotenv/config";
import { connectDb } from "./config/db";
import { PORT,CLIENT_URL } from "./constants/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware";
import routes from "./routes/index.route"

const app = express();
const port = PORT || 3000;

//? middlewares

app.use(express.json());
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet())
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello, World!");

});

//?all of our routes
app.use("/api",routes)

app.use(errorHandler)

app.listen(port, async () => {
  console.log(`server is listening on ${port}`);
  await connectDb();
});
