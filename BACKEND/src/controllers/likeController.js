import { Like } from "../models/like.js";
import mongoose from "mongoose";

// Like a recipe
const addLike = async (req, res) => {
  const recipeId = req.query.recipeId; // Assuming recipeId is passed as a query parameter
  const authorId = req.user._id; // Assuming req.user is set by your authentication middleware

  try {
    // Convert recipeId to ObjectId
    const newRecipeId = new mongoose.Types.ObjectId(recipeId);

    console.log(newRecipeId);
    console.log(authorId);

    // Check if the like already exists
    const existingLike = await Like.findOne({ author: authorId, recipe: newRecipeId });
    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this recipe.' });
    }

    // Create and save the new like
    const like = new Like({ author: authorId, recipe: newRecipeId });
    await like.save();

    res.status(201).json(like);
  } catch (error) {
    // Handle any errors
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid recipe ID' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
// Get likes for a recipe
const getLikes = async (req, res) => {
  const { recipeId } = req.query;

  try {
    const likes = await Like.find({ recipe: recipeId }).populate('author', 'username profilePicture');
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export{
  addLike,
  getLikes
}