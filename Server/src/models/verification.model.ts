import mongoose, { model, Schema } from "mongoose";
import VERIFICATIONTYPES from "../constants/verificationTypes";

export interface IVerification extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: VERIFICATIONTYPES;
  expiresAt: Date;
  createdAt: Date;
}

const verificationSchema = new Schema<IVerification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  }
});

const Verification = model<IVerification>("Verification", verificationSchema);

export default Verification;