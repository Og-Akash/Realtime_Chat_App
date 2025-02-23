import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { ZodError } from "zod";

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

  res.status(INTERNAL_SERVER_ERROR).json({
    error: err.message || "Internal Server Error",
  });
};
