import jwt from "jsonwebtoken"

import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import User from "../models/User.js"

const verifyAccessToken = asyncHandler(async (req, _, next) => {
    const reqHeader = req.headers['authorization']

    if(!reqHeader) throw new ApiError(401, "Unauthorized access")
    
    const token = reqHeader.replace("Bearer ", "")
    let decode;

    try {
        decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    } catch (error) {
        if(error.name === "TokenExpiredError") throw new ApiError(401, "Unauthorized access") // token expired
        throw new ApiError(401, "Unauthorized access") // invalid access token
    }

    const user = await User.findById(decode._id).select("-password")

    if(!user) throw new ApiError(401, "Unauthorized access") // invalid token

    req.user = user
    next()
})

const verifyRefreshToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies.refreshToken
    if(!token) throw new ApiError(401, "Unauthorized access")

    let decode;
    try {
        decode = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (error) {
        if(error.name === "TokenExpiredError") throw new ApiError(401, "Unauthorized access") // token expired
        throw new ApiError(401, "Unauthorized access") // invalid access token
    }

    const user = await User.findById(decode._id).select("-password")
    if(!user) throw new ApiError(401, "Unauthorized access") // invalid token
    if(user.refreshToken !== token) throw new ApiError(401, "Unauthorized access") // invalid token(incorrect token)

    req.user = user
    next()
})

export {verifyAccessToken, verifyRefreshToken}