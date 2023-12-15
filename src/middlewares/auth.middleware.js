import asyncHandeler from "../utils/asyncHandeler";
import ApiError from "../utils/apiError";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandeler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded?._id).select("-password -refreshToken");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Unauthorized");
  }
});
