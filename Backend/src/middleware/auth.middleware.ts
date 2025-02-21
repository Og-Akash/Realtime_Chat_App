// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { ObjectId } from "mongoose";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
    async (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ message: "Forbidden" });
      }

      const user = await User.findById(decoded.userId).select("_id role");
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      req.user = { userId: user?._id as ObjectId, role: user?.role };
      next(); // Pass control to the next middleware or route handler
    }
  );
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role!)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
