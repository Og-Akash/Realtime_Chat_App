import { NOT_FOUND, OK } from "../constants/http";
import userModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { asyncHandler } from "../utils/asyncHandler";


const userAuth = asyncHandler(async (req, res) => {
    const currentUser = await userModel.findById(req.userId);
    appAssert(currentUser, NOT_FOUND, "User not found");
    res.status(OK).json({
        user: currentUser.omitPassword()
    })
});

export {
    userAuth
}