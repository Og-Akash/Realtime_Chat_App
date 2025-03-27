import { NextFunction, RequestHandler, Request, Response } from "express";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { UNAUTHORIZED } from "../constants/http";
import { verifyToken } from "../utils/jwt";

const verifyJWT: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not Authorized",
    AppErrorCode.INVALIDACCESSTOKEN
  );

  const { error, payload } = verifyToken(accessToken);

  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "jwt expired" : "Invalid token",
    AppErrorCode.INVALIDACCESSTOKEN
  );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;
  next();
};

export default verifyJWT;
