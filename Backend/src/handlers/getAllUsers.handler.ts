import {Request, Response} from "express-serve-static-core"

export function getAllUsers(req: Request, res: Response) {
    res.status(200).json({
        status: "success",
    })
}