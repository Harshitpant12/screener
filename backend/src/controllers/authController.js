import bcrypt from "bcryptjs"

import User from "../models/User.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"

const register = asyncHandler(async function(req, res){
    const {name, email, password} = req.body

    const user = await User.findOne({email})

    if(user) {
        throw new ApiError(400, "User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    const {password: _, ...userWithoutPassword} = newUser.toObject()

    return res.status(201).json(new ApiResponse(201, userWithoutPassword, "User created successfully"))
    
})

const login = asyncHandler(async function(req, res){
    const {email, password} = req.body
    
    const user = await User.findOne({email})

    if(!user) {
        throw new ApiError(404, "User not found") // or we can use invalid credentials
    }

    // compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!isPasswordCorrect) throw new ApiError(400, "Invalid credentials")
    
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save()

    res.cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    })

    const {password: _, ...userWithoutPassword} = user.toObject()

    res.status(200).json(new ApiResponse(200, {
        accessToken: accessToken,
        userWithoutPassword,
    }, "Logged in successfully"))
})

const logout = asyncHandler(async function(req, res){
    const user = req.user // no need to check req.user -> null as we have verifyAccessToken before this controller
    user.refreshToken = null
    await user.save()
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'lax'
    })

    res.status(200).json(new ApiResponse(200, "Logged out successfully"))
})

const refresh = asyncHandler(function(req, res){
    const user = req.user
    const accessToken = user.generateAccessToken()

    res.status(200).json(new ApiResponse(200, {accessToken}, "Access Token refreshed Successfully"))
})

const getMe = asyncHandler(function(req, res){
    const user = req.user // we can directly return as well
    res.status(200).json(new ApiResponse(200, {user}, "User data fetched successfully")) // password is already excluded from user by verifyAccessToken middleware
})

export {register, login, logout, refresh, getMe}