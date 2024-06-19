import { asynHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asynHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  // check all fields are not empty
  if (
    [username, email, password, fullName].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required !");
  }

  // checking existing users
  const existingUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(400, "Username or Email already exists !");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImagelocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required !");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImagelocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar is required !");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    password,
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const resgistereduser = await User.findById(registerUser._id).select(
  "-password -refreshToken"
  );

  if (!resgistereduser) {
    throw new ApiError(400, "something went wrong while registering the user")
  }
  return res.status(201).json(
  new ApiResponse(200, resgistereduser, "user Registered successfully !")
  )
});

export default registerUser;
