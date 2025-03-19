import { NOT_FOUND, OK } from "../constants/http";
import userModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { asyncHandler } from "../utils/asyncHandler";

const userAuth = asyncHandler(async (req, res) => {
  const currentUser = await userModel.findById(req.userId);
  appAssert(currentUser, NOT_FOUND, "User not found");
  res.status(OK).json({
    user: currentUser.omitPassword(),
  });
});

const searchUserByQuery = asyncHandler(async (req, res) => {
  const { query } = req.params;

  const matchedUsers = await userModel.find({
    $or: [
      {
        username: {$regex: query, $options: "i"}, // Case-insensitive match
        email: {$regex: query, $options: "i"} // Case-insensitive match
      }
    ],
    _id: {$ne:req.userId}
  });
  
  appAssert(
    matchedUsers.length !== 0,
    NOT_FOUND,
    "No user with this query " + query
  );
  res.status(OK).json(matchedUsers);
});

export { userAuth, searchUserByQuery };
