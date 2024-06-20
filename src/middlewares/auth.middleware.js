import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError";
import asynHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = asynHandler(async (req, res, next) => {
try {
        const token = req.cookies?.accessToken || req.header;
        ("Authorization")?.replace("Bearer", "")
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCECC_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "invalid accessToken")
        }
    
        req.User = user
        next()
    } catch (error) {
        throw new ApiError(401,message,  "invalid accesstoken")
    }
})