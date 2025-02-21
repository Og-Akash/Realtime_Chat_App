// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/refreshToken.model";
import { ObjectId } from "mongoose";

// Generate access and refresh tokens
export const generateTokens = (userId: string |undefined, role: string |undefined) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// Verify access token
export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
      role: string;
    };
  } catch (error) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
      userId: string;
    };
  } catch (error) {
    return null;
  }
};

// Store refresh token in the database
export const storeRefreshToken = async (token: string, userId: string) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await RefreshToken.create({ token, userId, expiresAt });
};

// Remove refresh token from the database
export const removeRefreshToken = async (userId: ObjectId | undefined) => {
  await RefreshToken.deleteOne({ _id: userId });
};

// Check if a refresh token exists in the database
export const findRefreshToken = async (token: string) => {
  return await RefreshToken.findOne({ token }).exec();
};
