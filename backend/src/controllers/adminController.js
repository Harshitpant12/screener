import Analysis from "../models/Analysis.js";
import User from "../models/User.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find().select("-password -refreshToken")
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"))
})

const getAllAnalyses = asyncHandler(async(req, res) => {
    const analyses = await Analysis.find().populate("userId", "name email")
    return res.status(200).json(new ApiResponse(200, analyses, "Analyses fetched successfully"))
})