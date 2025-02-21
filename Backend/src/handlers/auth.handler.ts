// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { RefreshToken } from "../models/refreshToken.model";
import {
  generateTokens,
  removeRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { loginSchema } from "../schemas/user.schema";

const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  const users = await User.find({ _id: { $ne: req.user?.userId } }).select(
    "-password"
  );
  if (users.length > 0) {
    res.status(200).json({
      success: true,
      users,
    });
  }
  // Always  a response
  res.status(200).json({
    success: true,
    users: [],
  });
};

const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const image = req.file?.path;

  if (!image) {
    res.status(400).json({ message: "Profile image is required" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    image,
  });

  const { accessToken, refreshToken } = generateTokens(
    user._id as string,
    user.role
  );
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

  res.status(200).json({
    message: "User Registered successfully",
    user: {
      username: user.username,
      email: user.email,
      image: user.image,
      role: user.role,
    },
  });
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  //? sanitize the request body

  const validate = loginSchema.safeParse(email, password);
  if (!validate.success) {
    res.status(400).json({
      message: "Validation error",
      errors: validate.error.flatten,
    });
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(
    user?._id as string,
    user?.role
  );

  // Store refresh token in the database
  await storeRefreshToken(refreshToken, user?._id as string);

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

  // Send user data (excluding password)
  res.status(200).json({
    user: {
      _id: user?._id,
      username: user?.username,
      email: user?.email,
      image: user?.image,
      role: user?.role,
    },
  });
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(404).json({
      message: "No refresh token Found! Try to Login again!",
    });
  }

  const decodedData = verifyRefreshToken(refreshToken);

  if (!decodedData) {
    res.status(400).json({
      message: "failed to decode the refresh token!",
    });
  }

  // TRY TO FIND USER IF THERE IS A DECODED DATA
  const userData = await User.findById(decodedData?.userId);
  if (!userData) {
    res.status(404).json({
      message: "No user found!",
    });
  }
  const { accessToken } = generateTokens(
    userData?._id as string,
    userData?.role
  );

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
  const user = req.user;
  await removeRefreshToken(user?.userId);
  res.status(200).json({ message: "Logged out successfully" });
};

const getAuthUser = async (req: Request, res: Response) => {
  const user = req.user;
  const currentUser = await User.findById(user?.userId).select(
    "username email role,"
  );
  res.status(200).json(currentUser);
};

const updateProfile = async (req: Request, res: Response) => {
  const { username, profileImage } = req.body;
  const user = req.user;
  const updatedUserDetails = User.findOneAndUpdate(
    { _id: user?.userId },
    { username: username, image: profileImage },
    { new: true }
  );

  if (updatedUserDetails) {
    res
      .status(200)
      .json({ message: "user details updated", user: updatedUserDetails });
  } else {
    res.status(400).json({ message: "failed to update user details" });
  }
};

export {
  getAllUsers,
  registerUser,
  loginUser,
  refreshToken,
  getAuthUser,
  logoutUser,
  updateProfile,
};
