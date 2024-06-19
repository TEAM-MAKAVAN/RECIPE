import Recipe from "../models/recipe.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js"
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utilities/Cloudinary.js";
// Add a new recipe
exports.addRecipe = async (req, res) => {
  const {
    title,
    description,
    ingredients,
    instructions,
    cookingTime,
    difficulty,
    cuisineType,
    dietaryRestrictions,
    authorId,
  } = req.body;
  const imageLocalPath = req.files?.imageUrl.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Recipe image LocalPath  is required");
  }
  const recipeimage = await uploadOnCloudinary(imageLocalPath);

  const videoLocalPath = req.files?.videoUrl.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Recipe video LocalPath  is required");
  }
  const recipeVideo = await uploadOnCloudinary(videoLocalPath);

  try {
    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      cuisineType,
      dietaryRestrictions,
      author: authorId,
      imageUrl: recipeimage.url,
      videoUrl: recipeVideo.url,
    });
    await recipe.save();

    res.status(201).json(
      ApiResponse(200,recipe,"Recipe Uploaded Successfully")
    );
  } catch (error) {
    res.status(500).json(
      ApiError(400, "Unable to upload the Recipe"));
  }
};

// Get all recipes
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate(
      "author",
      "username profilePicture"
    );
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single recipe
exports.getRecipe = async (req, res) => {
  const { recipeId } = req.params;

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
