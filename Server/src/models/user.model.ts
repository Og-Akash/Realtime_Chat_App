import { NextFunction } from "express";
import { Schema, model, Document } from "mongoose";


export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  image: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
