import { Collection } from "../models/collection.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";

// Add a new collection
// --vansh

// 

const addCollection = async (req, res) => {
  const { title, description, recipes } = req.body;
  // console.log(req.body);

    const authorId=req.user._id; // get author id from verify JWT 
  try {

    const collection = await  Collection.create({
       title:title, 
      description:description,
       recipes:recipes, 
       author: authorId });
    if(!collection){
      throw new ApiError(404, "Unable to Add Collection")
    }

     res.status(201).json(
      new ApiResponse(201, collection, "Collection Added SuccessFully")
     );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all collections
//--vansh
const getCollections = async (req, res) => {
  try {
    // this is same as get recipes so i am not making any changes
    const collections = await Collection.find().populate('author', 'username profilePicture');
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// get collection by enetring a collection Id   --vansh
const getCollection = async (req, res) => {
  const { collectionId } = req.query;
 
 
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
const updateCollection = async (req, res) => {
  const { collectionId } = req.query;
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
const deleteCollection = async (req, res) => {
  const { collectionId } = req.query;

  try {
    const collection = await Collection.findByIdAndDelete(collectionId);
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found So unable to delete' });
    }
    
    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export { addCollection,
  getCollection,
  getCollections,
  deleteCollection,
  updateCollection
}
