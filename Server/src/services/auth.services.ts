import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import Session from "../models/session.model";
import userModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { generateToken } from "../utils/jwt";

export interface createAccountParams {
  username: string;
  email: string;
  password: string;
  image: string;
  userAgent?: string;
}
export interface loginParams {
  username: string;
  email: string;
  password: string;
  userAgent?: string;
}

export const createAccount = async (data: createAccountParams) => {
  //? verify the user if exists
  const existingUser = await userModel.exists({
    email: data.email,
  });

  appAssert(!existingUser, CONFLICT, "Email is already in use");

  //? create the account
  const user = await userModel.create({
    email: data.email,
    username: data.username,
    password: data.password,
    image: data.image,
  });
  //? create a session
  const session = await Session.create({
    userId: user._id,
    userAgent: data.userAgent,
  });
  //? sign the acces and refresh token
  const { accessToken, refreshToken } = generateToken(
    session._id as string,
    user._id as string
  );
  //? return the user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (data: loginParams) => {
  //?* if the user is exists
  const user = await userModel.findOne({
    $or: [
      {
        email: data.email,
        username: data.username,
      },
    ],
  });
  appAssert(user, UNAUTHORIZED, "invlid Email or Password!");
  //* validate the password
  const isPassMatched = await user.comparePassword(data.password);
  appAssert(isPassMatched, UNAUTHORIZED, "Email or Password not matched!");

  const userId = user._id;
  //* create session
  const session = await Session.create({
    userId,
    userAgent: data.userAgent,
  });
  //* geneate tokens
  const { accessToken, refreshToken } = generateToken(
    session._id as string,
    user._id as string
  );
  //* return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
