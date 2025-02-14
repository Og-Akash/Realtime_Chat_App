// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.model";
import { RefreshToken } from "../models/refreshToken.model";
import {
  generateTokens,
  removeRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import userModel from "../models/user.model";

const registerUser = async (req: Request, res: Response) => {
     const { username, email, password } = req.body;
    const image = req.file?.path;

    if (!image) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      image,
    });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    await RefreshToken.create({ token: refreshToken, userId: user._id });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ user: { ...user.toObject(), password: undefined } });
};

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Store refresh token in the database
    await storeRefreshToken(refreshToken, user._id);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data (excluding password)
    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    });
  
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(404).json({
      message: "No refresh token Found! Try to Login again!",
    });
  }

  const decodedData = verifyRefreshToken(refreshToken);

  if (!decodedData) {
    return res.status(400).json({
      message: "failed to decode the refresh token!",
    });
  }

  // TRY TO FIND USER IF THERE IS A DECODED DATA
  const userData = userModel.find({ _id: decodedData.userId });
  if (!userData) {
    return res.status(404).json({
      message: "No user found!",
    });
  }
  const { accessToken } = generateTokens(userData._id, userData.role);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  res.status(200).json({ message: "Token refreshed" });
};

const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  await removeRefreshToken(req?.user?.userId);
  res.status(200).json({ message: "Logged out successfully" });
};

export { registerUser, loginUser, refreshToken, logoutUser };
