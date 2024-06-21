import asynHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error, "Internal server error ");
  }
};

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
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(400, "username or email already exists !");
  }

  // Localfile path checking
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImagelocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required local file !");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImagelocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar is required cloudinary !");
  }

  //--Data enter to user model
  const newUser = await User.create({
    username: username.toLowerCase(),
    password,
    email,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // remove password & refresh token
  const resgistereduser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  ); // select() is used to ommit fields

  if (!resgistereduser) {
    throw new ApiError(400, "something went wrong while registering the user");
  } 
  return res
    .status(201)
    .json(
      new ApiResponse(200, resgistereduser, "user Registered successfully !")
    );
});

const userLogin = asynHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "Please Enter username or email");
  }

  const user = await User.findOne({
    $or: [{username}, {email}],
  });

  if (!user) {
    throw new ApiError(404, "User does not exists !");
  }
  const validPassword = await user.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(401, "Invalid user credentials !");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Login Successfully!!!"
      )
    );
});

const logoutUser = asynHandler(async (req, res) => {});

export { registerUser, userLogin, logoutUser };
