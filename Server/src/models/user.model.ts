import { Schema, model, Document } from "mongoose";
import { compareHash, hashValue } from "../utils/bcrypt";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  image: string;
  role: "user" | "admin";
  bio: string;
  isVerified: boolean;
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Pick<
    IUser,
    "_id" | "username" | "email" | "role" | "image" | "createdAt" | "updatedAt"
  >;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/duicdshi7/image/upload/f_auto,q_auto/v1/chat-app/xngxcjzjkgto8rxigl3i",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bio: {
      type: String,
      default: "Hey this is my bio",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = function (val: string) {
  const hashedPassword = this.password;
  return compareHash(val, hashedPassword);
};
userSchema.methods.omitPassword = function () {
  const userObj = this.toObject(); // Convert to a plain object
  delete userObj.password; // Remove password
  return userObj;
};

export default model<IUser>("User", userSchema);
