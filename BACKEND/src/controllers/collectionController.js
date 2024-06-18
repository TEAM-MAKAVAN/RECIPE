import { Collection } from "../models/collection.js";

// Add a new collection
exports.addCollection = async (req, res) => {
  const { title, description, recipes, authorId } = req.body;

  try {
    const collection = new Collection({ title, description, recipes, author: authorId });
    await collection.save();
    
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all collections
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().populate('author', 'username profilePicture');
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single collection
exports.getCollection = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const collection = await Collection.findById(collectionId).populate('author', 'username profilePicture').populate('recipes');
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a collection
exports.updateCollection = async (req, res) => {
  const { collectionId } = req.params;
  const { title, description, recipes } = req.body;

  try {
    const collection = await Collection.findByIdAndUpdate(
      collectionId,
      { title, description, recipes },
      { new: true }
    );
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a collection
exports.deleteCollection = async (req, res) => {
  const { collectionId } = req.params;

  try {
    const collection = await Collection.findByIdAndDelete(collectionId);
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
