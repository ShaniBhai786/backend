import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    avatar: { 
        type: String,   // from cloudinary
        required: true,
    },
    coverImage: { 
        type: String,   // from cloudinary
        required: true,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true})

// ---pre function is used to save an instance before execution
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)//---"hash" is used to encoding of password
    next()
});

// ---password comparison using bycrypt
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

// ---Generate an AccessToken for (id, email, username, fullName) and assigns these fields to JWT
userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id: this._id,
            email: this.fullName,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCECC_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCECC_TOKEN_EXPIRY
        }
    )
}

// ---Generate an RefreshToken for (id) and assigns these fields to JWT
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)