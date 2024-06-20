import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utilities/Cloudinary.js";
import { ApiError } from "../utilities/ApiError.js";

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (
    [fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with this email or username already Existed");
  }
  const profilePictureLocalPath = req.files?.profilePicture[0]?.path;
  if (!profilePictureLocalPath) {
    throw new ApiError(400, "ProfilePicture LocalPath  is required");
  }

  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    //const user = new User({ username, email, password: hashedPassword });

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

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
    //   expiresIn: "1h",
    // });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

// Update user profile
const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, email, bio, profilePicture } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { username, email, bio, profilePicture },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Follow a user
const followUser = async (req, res) => {
  const { userId, followId } = req.params;

  try {
    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user || !followUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.following.includes(followId)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    user.following.push(followId);
    followUser.followers.push(userId);

    await user.save();
    await followUser.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const { userId, unfollowId } = req.params;

  try {
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);

    if (!user || !unfollowUser) {
      return res.status(404).json({ message: "User not found" });
    }

    user.following = user.following.filter(
      (id) => id.toString() !== unfollowId
    );
    unfollowUser.followers = unfollowUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await unfollowUser.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  registerUser,
  loginUser,
  updateUserProfile,
  followUser,
  unfollowUser,
  getUserProfile,
};
