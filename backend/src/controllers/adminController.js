import Analysis from "../models/Analysis.js";
import User from "../models/User.js";
import ApiError from "../utils/apiError.js";
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

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)

    if(!user) throw new ApiError(404, "User not found")
    if(user.role === "admin") throw new ApiError(403, "Cannot delete an admin")

    await User.findByIdAndDelete(id)
    await Analysis.deleteMany({ userId: id }) // also deleting all the analyses by the user

    return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"))
})

export { getAllUsers, getAllAnalyses, deleteUser }