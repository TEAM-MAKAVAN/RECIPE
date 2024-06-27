import express from "express";
import { Router } from "express";
import {
  registerUser,
  login,
  verifyOtp,
  getUserProfile,
  logoutUser,
  changeCurrentPassword,
  updateUserProfilePicture,
  updateAccountDetails
} from '../controllers/userController.js';

import { uploadImage } from '../middlewares/multer.js';
import verifyJWT from "../middlewares/auth.middleware.js";

const app = express();
const router = Router();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Register a new user
router.post('/register', uploadImage.single('profilePicture'), registerUser);

// login a user
router.post('/login', login);

// verify OTP
router.post('/verify-otp', verifyOtp);

// Get user profile
router.get('/users/:userId', getUserProfile);

// Update user profile picture
router.post('/change-profilePicture', uploadImage.single('newProfilePicture'), verifyJWT, updateUserProfilePicture);

// Update user details (username & bio)
router.post('/update-details', verifyJWT, updateAccountDetails);

// Change current password
router.post('/change-password', verifyJWT, changeCurrentPassword);

// Logout user
router.post('/logout', verifyJWT, logoutUser);

// Export router for use in app
export { router };


// import express from "express";
// const app = express();

// app.use(express.json());
// import { Router } from "express";
// import {
//   registerUser,
//   login,
//   verifyOtp,
  
//   //followUser,
//   //unfollowUser,
//   getUserProfile,
//   logoutUser,
//   changeCurrentPassword,
//   updateUserProfilePicture,
//   updateAccountDetails
  
// } from '../controllers/userController.js';

// import { uploadImage } from '../middlewares/multer.js'; // Import the multer upload middleware
// // import { Recipe } from "../models/recipe.js";
// import verifyJWT from "../middlewares/auth.middleware.js";


// const router = Router();

// // Register a new user
// router.post('/register', uploadImage.single('profilePicture'), registerUser);



//  app.use(express.json());
//  app.use(express.urlencoded({ extended: true }));



// // login a user
//  router.post('/login', login); 

//  // verify - otp 
//  router.post('/verify-otp', verifyOtp); 



// // Get user profile
// router.get('/users/:userId', getUserProfile);

// // Update user profilePicture  routes added    
// router.post('/change-profilePicture',uploadImage.single('newProfilePicture'),verifyJWT, updateUserProfilePicture);


// // update user details(username & bio) --vansh
// router.post('/update-details',verifyJWT,updateAccountDetails)

// //change current password  new route added!  
// //router.post('/change-password',verifyJWT,changeCurrentPassword)
// router.route("/change-password").post(verifyJWT, changeCurrentPassword);


// // Follow a user
// //router.post('/users/:userId/follow/:followId', followUser);

// // Unfollow a user
// //router.post('/users/:userId/unfollow/:unfollowId', unfollowUser);

// //logout user
// router.route("/logout").post(verifyJWT, logoutUser);

// export { router };





