import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import Session from "../models/session.model";
import { asyncHandler } from "../utils/asyncHandler";
import appAssert from "../utils/appAssert";

const sessionHandler = asyncHandler(async (req, res) => {
  const sessions = await Session.find(
    {
      userId: req.userId,
      expiresAt: { $gt: Date.now() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    }
  );

  return res.status(OK).json(
    // mark the current session
    sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === req.sessionId && {
        isCurrent: true,
      }),
    }))
  );
});

const deleteSession = asyncHandler(async (req, res) => {
  const parsedId = z.string().parse(req.params.id);
  const deletedSession = await Session.findOneAndDelete({
    _id: parsedId,
    userId: req.userId,
  });

  appAssert(deletedSession, NOT_FOUND, "failed to delete sessions");

  res.status(OK).json({
    message: "Session deleted successfully",
  });
});

export { sessionHandler, deleteSession };
