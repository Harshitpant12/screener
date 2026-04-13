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

export {register}