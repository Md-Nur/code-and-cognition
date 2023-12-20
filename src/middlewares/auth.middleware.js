import asyncHandeler from "../utils/asyncHandeler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandeler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers?.Authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid token");
  }
});
