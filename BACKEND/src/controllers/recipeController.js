import Recipe from "../models/recipe.js";
import { User } from "../models/user.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js"
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utilities/Cloudinary.js";
// Add a new recipe

export const addRecipe = async (req, res) => {
  const {
    title,
    description,
    ingredients,
    instructions,
    category, // newly field Added  and required also
    cookingTime,
    difficulty,
    cuisineType,
    dietaryRestrictions,
  } = req.body;

    if(!( title ||
      description||
      ingredients||
      instructions||
      category)){
        throw new ApiError( 400, " Title Description Ingredients Instructions And Category are Required Field! please Enter All these info About Recipe!")
      }
  try {
    // Ensure image and video files are uploaded
    const imageLocalPath = req.files['image'][0].path;
    const videoLocalPath = req.files['video'][0].path

    if (!imageLocalPath) {
      throw new ApiError(400, "Recipe image is required");
    }
    if (!videoLocalPath) {
      throw new ApiError(400, "Recipe video is required");
    }

    // Upload files to Cloudinary
    const recipeImage = await uploadOnCloudinary(imageLocalPath);
    const recipeVideo = await uploadOnCloudinary(videoLocalPath);

    // Create a new recipe
    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      category,
      cookingTime,
      difficulty,
      cuisineType,
      dietaryRestrictions,
      author: req.user._id,
      imageUrl: recipeImage.url,
      videoUrl: recipeVideo.url,
    });

    // Save the recipe to the database
    await recipe.save();

    // Send a successful response
    res.status(201).json(
     new ApiResponse(201, recipe, "Recipe uploaded successfully")
    );
  } catch (error) {
    console.error('Error uploading recipe:', error);

    if (error instanceof ApiError) {
      res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      res.status(500).json(new ApiResponse(500, null, "Unable to upload the recipe"));
    }
  }
};
// Get all recipes // TOTAL RECIPES UPLAODED :- MAIN HOME PAGE
export const getRecipes = async (req, res) => {
  
  try {
   
    const recipes = await Recipe.find().populate(
      "author",
     
    );
    console.log(recipes);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single recipe     RECIPE FIND
export const getRecipe = async (req, res) => {
  const { recipeId } = req.query;
  ;

  try {
    const recipe = await Recipe.findById(recipeId)
      .populate("author", "username profilePicture")
      .populate("comments")
      .populate("likes");
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch saved recipes for a user
export const fetchSavedRecipes = async (req, res) => {
  const userId = req.params.userId; // Assuming userId is passed as a route parameter

  try {
    // Find the user by userId and populate the savedRecipes array
    const user = await User.findById(userId).populate('savedRecipes');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the populated recipes from user's savedRecipes
    const savedRecipes = user.savedRecipes;
    console.log(savedRecipes)

    res.status(200).json(savedRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
