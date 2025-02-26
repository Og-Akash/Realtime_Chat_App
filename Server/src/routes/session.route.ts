import { Router } from "express";
import { sessionHandler, deleteSession } from "../handler/session.handler";

const route = Router();

route.get("/getSessions", sessionHandler);
route.delete("/delteSession/:id", deleteSession);

export default route;
