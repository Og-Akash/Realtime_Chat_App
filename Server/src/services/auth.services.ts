import { CLIENT_URL } from "../constants/env";
import {
  BAD_REQUEST,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../constants/http";
import VERIFICATIONTYPES from "../constants/verificationTypes";
import Session from "../models/session.model";
import userModel, { IUser } from "../models/user.model";
import Verification from "../models/verification.model";
import appAssert from "../utils/appAssert";
import { hashValue } from "../utils/bcrypt";
import {
  fiveMinutesAgo,
  fiveMinutesFromNow,
  oneDayInMS,
  sevenDaysFromNow,
} from "../utils/date";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplates";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";
import { sendMail } from "../utils/sendMail";
import cloudinary from "../config/cloudinary";
import { Multer } from "multer";

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

export interface ResetPassword {
  password: string;
  code: string;
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

  const verificationCode = await Verification.create({
    userId: user._id,
    type: VERIFICATIONTYPES.EMAILVERIFICATION,
    expiresAt: fiveMinutesFromNow(),
  });

  const url = `${CLIENT_URL}/api/auth/v1/email/verify/${verificationCode._id}`;

  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });

  appAssert(!error,INTERNAL_SERVER_ERROR, "failed to send email")

  if (error) {
    console.log(`Email sending Error: `, error);
  }

  //? create a session
  const session = await Session.create({
    userId: user._id,
    userAgent: data.userAgent,
  });

  //? sign the acces and refresh token
  const sessionInfo = {
    sessionId: session._id,
  };

  //* Access token Generate
  const accessToken = signToken({ userId: user._id, ...sessionInfo });
  //* Refresh token Generate
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

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

  //? sign the acces and refresh token
  const sessionInfo = {
    sessionId: session._id,
  };

  //* Access token Generate
  const accessToken = signToken({ userId: user._id, ...sessionInfo });
  //* Refresh token Generate
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  //* return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");
  const session = await Session.findById(payload.sessionId);
  appAssert(
    session && session.expiresAt.getTime() > Date.now(),
    UNAUTHORIZED,
    "session is not exists or expires."
  );

  //? refresh the session if it's expires within 24 hours

  const sessionNeedsRefresh =
    session.expiresAt.getTime() - Date.now() <= oneDayInMS;
  if (sessionNeedsRefresh) {
    session.expiresAt = sevenDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  const accessToken = signToken({
    sessionId: session._id,
    userId: session.userId,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const verifyEmailByCode = async (code: string) => {
  //* get the verification code
  const validCode = await Verification.findOne({
    _id: code,
    type: VERIFICATIONTYPES.EMAILVERIFICATION,
    expiresAt: { $gt: new Date() },
  });

  appAssert(
    validCode,
    NOT_FOUND,
    "The Verification code may Invalid or expires"
  );

  //* get the user by id and update the user verifying field
  const updatedUser = await userModel.findByIdAndUpdate(
    validCode.userId,
    {
      isVerified: true,
    },
    { new: true }
  );

  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to vefiry email");
  //* delete the verification code

  validCode.deleteOne();
  //* return user
  return {
    user: updatedUser.omitPassword(),
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  const userData = await userModel.findOne({ email });
  appAssert(userData, NOT_FOUND, "User not found");

  //* rate limit of sending email for last 5 min
  const fiveMinAgo = fiveMinutesAgo();
  const count = await Verification.countDocuments({
    userId: userData._id,
    type: VERIFICATIONTYPES.PASSWORDVERIFICATION,
    expiresAt: { $gt: fiveMinAgo },
  });

  appAssert(
    count <= 1,
    TOO_MANY_REQUESTS,
    "too many request please try again later."
  );

  //* create the verification code.
  const expiresAt = fiveMinutesFromNow();
  const verificationCode = await Verification.create({
    userId: userData._id,
    type: VERIFICATIONTYPES.PASSWORDVERIFICATION,
    expiresAt,
  });
  //* send the mail
  const url = `${CLIENT_URL}/api/auth/v1/reset?code=${
    verificationCode._id
  }&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendMail({
    to: userData.email,
    ...getPasswordResetTemplate(url),
  });

  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`
  );

  //* return
  return {
    email: data.id,
    url,
  };
};

export const resetPassword = async ({ password, code }: ResetPassword) => {
  //* get the verification code
  const validCode = await Verification.findOne({
    _id: code,
    type: VERIFICATIONTYPES.PASSWORDVERIFICATION,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  //* check for validity and if true then update the passowrd or thorow error
  const updateUser = await userModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password),
  });
  appAssert(updateUser, INTERNAL_SERVER_ERROR, "Failed to reset password");

  //* delete the verification code
  await validCode.deleteOne();

  //* return the response
  return {
    user: updateUser.omitPassword(),
  };
};

export const updateUser = async (file:any,bio:string = "") => {
  let updatedUserData: { image?: string; bio?: string } = {};

  if (file) {
    appAssert(file, BAD_REQUEST, "profile image is invalid");
    //* Upload image
    const imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    const response = await cloudinary.uploader.upload(imageBase64, {
      folder: "chat-app",
      transformation: { quality: "auto" },
    });

    console.log("cloudinary secure url:", response.secure_url);
    appAssert(response, BAD_REQUEST, "Failed to upload profile image");

    updatedUserData.image = response.secure_url;
  }

  //* check if the req have bio
  if (bio) {
    updatedUserData.bio = bio;
  }

  appAssert(
    Object.keys(updatedUserData).length > 0,
    BAD_REQUEST,
    "No user details provided for update"
  );
  return updatedUserData
}