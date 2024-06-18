import { Like } from "../models/like.js";

// Like a recipe
const addLike = async (req, res) => {
  const { recipeId } = req.params;
  const { authorId } = req.body;
  
  try {
    const existingLike = await Like.findOne({ author: authorId, recipe: recipeId });
    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this recipe.' });
    }

    const like = new Like({ author: authorId, recipe: recipeId });
    await like.save();

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get likes for a recipe
const getLikes = async (req, res) => {
  const { recipeId } = req.params;

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