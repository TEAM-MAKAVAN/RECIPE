import { User } from "../models/user.js";
import { Subscription } from "../models/subscription.js";
import * as bcrypt from 'bcrypt';
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utilities/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utilities/Cloudinary.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
// Import all exports from auth.middleware.js
import * as AuthMiddleware from "../middlewares/auth.middleware.js";




const generateAccessAndRefreshToken = async function (userId) {
  try {
    // Check if userId is valid
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    // Find the user by userId
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate access token
    const accessToken = await user.generateAccessToken();

    // Generate refresh token
    const refreshToken = await user.generateRefreshToken();

    // Log tokens for debugging purposes
    // console.log("Access Token:", accessToken);
    // console.log("Refresh Token:", refreshToken);

    // Update user with the new refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generateAccessAndRefreshToken:", error);
    if (error instanceof ApiError) {
      throw error; // Re-throw known API errors
    } else {
      throw new ApiError(
        500,
        "Something went wrong while generating refresh and access tokens"
      ); // Throw a general error for unexpected issues
    }
  }
};


// Access the verifyJWT function from AuthMiddleware
const { verifyJWT } = AuthMiddleware;

// Register a new user
const registerUser = async (req, res) => {

  const { username, email, password } = req.body;
  
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are required");

  }


  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with this email or username already Existed");
  }

  const profilePictureLocalPath = req.file?.path;

  if (!profilePictureLocalPath) {
    throw new ApiError(400, "ProfilePicture LocalPath is required");
  }

  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      username: username.toLowerCase(),
      profilePicture: profilePicture.url,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email);
  // console.log(password);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(password);
    // console.log(user.password);
    const hashedPassword = "user.password";
    // const isMatch = await bcrypt.compare(password, user.password);
    // const isMatch = await user.isPasswordCorrect(user.password);
    // const isMatch = await bcrypt.compare(password, hashedPassword)
    
const isMatch = async () => {
  // Load hash from your password DB.
  const isMatch = await bcrypt.compare(password, hashedPassword);}
    // console.log(isMatch)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        status: 200,
        data: {
          user,
          accessToken,
          refreshToken,
        },
        message: "User logged in successfully"
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Looged out"));
});

// Get user profile
const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// change cuurent password    
const changeCurrentPassword = asyncHandler(async (req, res) => {
  
  // console.log(req);
  const { oldPassword, newPassword, confirmPassword} = req.body;
// console.log(oldPassword,email);
 if (!(newPassword === confirmPassword)) {
    throw new ApiError(401, "new password and confirm password must be same");
  }
    // console.log(req.user)
    ;
  const user = await User.findById(req.user._id);
 
  
  // const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  const hashedPassword = "user.password";
    
const isPasswordCorrect= async () => {
  // Load hash from your password DB.
  const isMatch = await bcrypt.compare(password, hashedPassword);}
    console.log(isPasswordCorrect)
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Succesfully"));
});


// Update user profilePicture   
const updateUserProfilePicture = asyncHandler(async (req, res) => {
  const profilePictureLocalPath = req.file?.path;

  if (!profilePictureLocalPath) {
    throw new ApiError(400, "No local path found");
  }

  // Fetch the current user document
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if there is a previous profilePicture URL in dataBase or not
  const oldProfilePictureUrl = user.profilePicture;

  // Optional: Delete the old avatar from Cloudinary or your storage //we will work later
  // if (oldProfilePictureUrl) {
  //   await deleteFromCloudinary(oldProfilePictureUrl); // Implement this function to delete the image from Cloudinary
  // }

  // Upload the new avatar to Cloudinary
  const newProfilePicture = await uploadOnCloudinary(profilePictureLocalPath);

  if (!newProfilePicture.url) {
    throw new ApiError(400, "Error while uploading the new avatar");
  }

  // Update the user's avatar URL in the database
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profilePicture: newProfilePicture.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile Picture Updated Successfully"));
});

//update user details or personal info      --vansh
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, bio } = req.body;
      
  if (!(bio || username )) {
    throw new ApiError(400, "All fields are required");
  }


  
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username,
        bio
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated succcessfully"));
});





// Follow a user
// const followUser = async (req, res) => {
//   const { userId, followId } = req.params;

//   try {
//     const user = await User.findById(userId);
//     const followUser = await User.findById(followId);

//     if (!user || !followUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.following.includes(followId)) {
//       return res
//         .status(400)
//         .json({ message: "You are already following this user" });
//     }

//     user.following.push(followId);
//     followUser.followers.push(userId);

//     await user.save();
//     await followUser.save();

//     res.status(200).json({ message: "User followed successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Unfollow a user
// const unfollowUser = async (req, res) => {
//   const { userId, unfollowId } = req.params;

//   try {
//     const user = await User.findById(userId);
//     const unfollowUser = await User.findById(unfollowId);

//     if (!user || !unfollowUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.following = user.following.filter(
//       (id) => id.toString() !== unfollowId
//     );
//     unfollowUser.followers = unfollowUser.followers.filter(
//       (id) => id.toString() !== userId
//     );

//     await user.save();
//     await unfollowUser.save();

//     res.status(200).json({ message: "User unfollowed successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) {
    throw new ApiError(404, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        email: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User Channel fetched successfully")
    );
});
export {
  registerUser,
  login,
  //followUser,
  //unfollowUser,
  getUserProfile,
  logoutUser,
  changeCurrentPassword,
  updateUserProfilePicture,
  updateAccountDetails,
  getUserChannelProfile
  
};
