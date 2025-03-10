import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import jwt from "jsonwebtoken"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

import { User } from "../models/user.model.js"


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const signupUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body
    //console.log("email: ", email);

    if (
        [username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //upload avatar
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    console.log(avatarLocalPath)
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Something went wrong while uploading avatar on cloudinary")
    }
    console.log(process.env.CLOUDINARY_API_KEY)

    //create user
    const user = await User.create({
        username,
        email,
        avatar: avatar ? avatar.url : "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_960_720.png",
        password,
        role,
    })
    // Generate tokens after user creation
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: createdUser,
                accessToken,
                refreshToken
            }, "User registered Successfully")
        )
})

const loginUser = asyncHandler(async (req, res) => {
    console.log("I have been hit")
    const { email, password } = req.body
    console.log(email);

    if (!email) {
        throw new ApiError(401, "email is required")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    console.log(user.username)

    const isValidPassword = await user.isPasswordCorrect(password)
    if (!isValidPassword) {
        throw new ApiError(401, "Invalid password")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    console.log(loggedInUser.username)
    if (!loggedInUser) {
        throw new ApiError(500, "Something went wrong while logging the user")
    }
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            }, "User logged in Successfully")
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }, { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
        new ApiResponse(200, {}, "User logged out Successfully")
    )
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { user, accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")

    }

    //delete old image from cloudinary
    const olduser = await User.findById(req.user?._id)
    const oldAvatarUrl = olduser.avatar
    if (oldAvatarUrl) {
        await deleteFromCloudinary(oldAvatarUrl)
    }


    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar image updated successfully")
        )
})

const getAllMembers = asyncHandler(async(req,res)=>{
    const members = await User.find({role: "MEMBER"})
    if(!members){
        ApiError(404, "Members not found")
    }

    return   res
    .status(200)
    .json(new ApiResponse(200, members, "Members Fetched Successfully"))
})

export { signupUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, updateUserAvatar, getAllMembers }