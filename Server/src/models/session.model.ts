import mongoose, { Schema, model } from "mongoose";
import { sevenDaysFromNow } from "../utils/date";

export interface ISession extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userAgent: {
    types: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: sevenDaysFromNow,
  },
});

const Session = model<ISession>("Session", sessionSchema);
export default Session;
