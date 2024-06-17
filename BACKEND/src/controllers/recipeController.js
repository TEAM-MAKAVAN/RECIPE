import Recipe from "../models/recipe"

// Add a new recipe
exports.addRecipe = async (req, res) => {
  const { title, description, ingredients, instructions, cookingTime, difficulty, cuisineType, dietaryRestrictions, authorId, imageUrl, videoUrl } = req.body;

  try {
    const recipe = new Recipe({ title, description, ingredients, instructions, cookingTime, difficulty, cuisineType, dietaryRestrictions, author: authorId, imageUrl, videoUrl });
    await recipe.save();
    
    res.status(201).json(recipe);
  } catch (error) {

    res.status(500).json({ error: error.message });
    
  }
};

// Get all recipes
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'username profilePicture');
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single recipe
exports.getRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId).populate('author', 'username profilePicture').populate('comments').populate('likes');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
