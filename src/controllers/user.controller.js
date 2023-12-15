import asyncHandler from "../utils/asyncHandeler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";

const accessTokenAndRefreshToken = async (userId) => {
  try {
    const user = User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (e) {
    throw new ApiError(
      500,
      "Something went wrong while creating tokens. " + e.message
    );
  }
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
  // Get data from frontend
  const { username, email, fullName, password } = req.body;

  // Validation of empty fields
  if (
    [username, email, fullName, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user exists: username, email
  const exitsUsername = await User.findOne({ username });
  if (exitsUsername) {
    throw new ApiError(409, "Username already exists");
  }

  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new ApiError(409, "Email already exists");
  }

  // check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading avatar");
  }

  // create user object in mongo db
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    password,
    avatar: avatar.url,
  });

  // remove password and refresh token from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // chcek to user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  // send response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  // Get data from frontend
  const { email_name, password } = req.body;
  // Check empty fields (username, password)
  if ([email_name, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user exists (username or email)
  const user = await User.findOne({
    $or: [{ username: email_name }, { email: email_name }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // Check if password is correct
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password is incorrect");
  }

  // Access and Generate token
  const { accessToken, refreshToken } = await accessTokenAndRefreshToken(
    user._id
  );

  option = {
    httpOnly: true,
    secure: true,
  };

  // Create logged in user object
  const loggedInUser = User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

  option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export { registerUser, loginUser };
