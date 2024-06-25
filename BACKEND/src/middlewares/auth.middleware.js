import { ApiError } from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import sendEmail from '../utilities/sendEmail.js';
import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const authRouter = Router();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

// http://localhost:8001/api/v1/auth/send-otp?email=mastikr1245@gmail.com

// Send OTP
authRouter.post('/send-otp', async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
console.log(user);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const otp = generateOTP();
  const otpToken = jwt.sign({ otp, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' }); // OTP expires in 10 minutes

  await sendEmail(email, otp);

  res.status(200).json({ otpToken });
});

// Verify OTP

authRouter.post('/verify-otp', async (req, res) => {
  const { otp } = req.query;
  console.log('OTP from query:', otp);

  // Extract otpToken from the Authorization header
  const authHeader = req.headers.authorization;
  let otpToken;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    otpToken = authHeader.split(' ')[1];
  } else {
    return res.status(400).json({ message: 'OTP token is missing or invalid' });
  }
  console.log('OTP Token:', otpToken);

  try {
    // Verify and decode the otpToken
    const decoded = jwt.verify(otpToken, process.env.ACCESS_TOKEN_SECRET);
    console.log('Decoded Token:', decoded);

    // Check if the decoded OTP matches the one sent in the query
    const decodedOtp = String(decoded.otp);
    if (decodedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }


    // now if OTP matches with the sent OTP we will change the field "isVerified" to true;
     
    if(decodedOtp== otp){
      // abhi  ye likhna hai
    }



    // If OTP verification succeeds
    
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'OTP token has expired' });
    }
    console.error('JWT Verification Error:', err.message);
    res.status(400).json({ message: 'OTP verification failed' });
  }
});

 const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

      

    if (!token) {
      throw new ApiError(401, "Unathorized Access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user=user;
    next()

    
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }

  
});

export default verifyJWT
export { authRouter }


















// // auth.middleware.js
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.js";
// import { ApiError } from '../utilities/ApiError.js';

// export const verifyJWT = (token) => {
//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     return decoded;
//   } catch (error) {
//     throw new ApiError(401, 'Invalid authentication token');
//   }
// };

// export const authenticate = async (req, res, next) => {
//   const token = req.header('Authorization').replace('Bearer ', '');

//   if (!token) {
//     throw new ApiError(401, 'Authentication token is missing');
//   }

//   try {
//     const decoded = verifyJWT(token);
//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       throw new ApiError(404, 'User not found');
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     next(new ApiError(401, 'Invalid authentication token'));
//   }
// };

