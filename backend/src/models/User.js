import mongoose from "mongoose";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    refreshToken: {
        type: String,
        default: null,
    }
},
{
    timestamps: true
}
)

userSchema.methods.generateAccessToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES
    })
    return token
}

userSchema.methods.generateRefreshToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    })
    return token
}

const User = mongoose.model("User", userSchema)

export default User;