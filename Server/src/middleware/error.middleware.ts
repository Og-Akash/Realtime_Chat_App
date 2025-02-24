import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { ZodError } from "zod";
import AppError from "../utils/appError";

const handleZodError = (res: Response, error: ZodError) => {
  const errors = error.errors.map((error) => ({
    path: error.path.join("."),
    message: error.message,
  }));
  return res.status(BAD_REQUEST).json({
    message: error.format(),
    errors,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  res
    .status(error.statusCode)
    .json({ message: error.message, errorCode: error.errorCode });
};

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`PATH ${req.path}`, err);

  if (err instanceof ZodError) {
    handleZodError(res, err);
  }
  if (err instanceof AppError) {
    handleAppError(res, err);
  }

  res.status(INTERNAL_SERVER_ERROR).json({
    error: err.message || "Internal Server Error",
  });
};
