import { ApiError } from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import sendEmail from '../utilities/sendEmail.js';
import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

 const authRouter = Router();

 const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (typeof token == 'string') {
      token = token.trim(); // Trim the token if it's a string
    }

   

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodedToken);

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error.message || "Invalid Access Token"));
  }

});

export default verifyJWT;
export { authRouter }
















