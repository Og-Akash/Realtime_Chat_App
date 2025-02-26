import mongoose from "mongoose";


declare global {
    namespace Express {
        interface Request {
            userId: mongoose.types.objectId;
            sessionId: mongoose.types.objectId;

            file: Multer.File
        }
    }
}