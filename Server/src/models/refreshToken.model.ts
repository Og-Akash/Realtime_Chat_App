import mongoose, { model, Schema } from "mongoose";

export interface IRefreshToken extends mongoose.Document {
  token: string;
  userId: Schema.Types.ObjectId;
  expiresAt: Date;
}

const RefreshTokenSchema = new Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  expiresAt: { type: Date, required: true },
});

export const RefreshToken = model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);
