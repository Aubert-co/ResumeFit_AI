import { Types } from "mongoose"

export type JwtPayload = {
    id:Types.ObjectId,
    email:string
}