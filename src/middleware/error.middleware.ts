import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation error",
      errors: err.errors,
    });
    return;
  }

  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
