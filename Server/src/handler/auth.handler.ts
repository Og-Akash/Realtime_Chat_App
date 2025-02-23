import { BAD_REQUEST } from "../constants/http";
import userModel from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { z } from "zod";
import bcrypt from "bcrypt";

const RegisterSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(20),
  image: z.string(),
  userAgent: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
  userAgent: z.string().optional(),
});

const getAllUser = asyncHandler(async (req, res, next) => {
  //* Fetch all users from the database
  const allUsers = await userModel.find();
  if (allUsers.length > 0) {
    return res.status(200).json(allUsers);
  }
  return res.status(404).json({ message: "No users found" });
});

const register = asyncHandler(async (req, res, next) => {
  const parsedData = RegisterSchema.safeParse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  if (!parsedData.success) {
    throw parsedData.error;
  }

  const existingUser = await userModel.findOne({
    email: parsedData.data.email,
  });

  if (existingUser) {
    res.status(BAD_REQUEST).json({
      message: "Email already exists",
    });
  }

  const userData = {
    username: parsedData.data.username,
    email: parsedData.data.email,
    password: parsedData.data.password,
    image: parsedData.data.image,
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  userData.password = hashedPassword;

  const newUser = await userModel.create(userData);

  res.status(201).json(newUser);
});

const login = asyncHandler(async (req, res, next) => {});

const logout = asyncHandler(async (req, res, next) => {});

const authAuth = asyncHandler(async (req, res, next) => {});

export { getAllUser, register, login, logout, authAuth };
