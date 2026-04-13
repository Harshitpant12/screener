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
        sameSite: "strict",
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    })

    const {password: _, ...userWithoutPassword} = user.toObject()

    res.status(200).json(new ApiResponse(200, {
        accessToken: accessToken,
        userWithoutPassword,
    }, "Logged in successfully"))
})

export {register, login}