import { Comment } from "../models/comment.js";
import Recipe from "../models/recipe.js";

// Add a comment to a recipe
export const addComment = async (req, res) => {
  const { recipeId } = req.query;
  const { text } = req.query; // Ensure text is correctly extracted from the request body
  const authorId = req.user._id;

  try {
    // Create a new comment
    const comment = new Comment({ text, author: authorId, recipe: recipeId });
    await comment.save();

    // Update the recipe to include the new comment
    const recipe = await Recipe.findById(recipeId);
    recipe.comments.push(comment._id);
    await recipe.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get comments for a recipe
export const getComments = async (req, res) => {
  const { recipeId } = req.query;

  try {
    const comments = await Comment.find({ recipe: recipeId }).populate('author', 'username profilePicture');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
