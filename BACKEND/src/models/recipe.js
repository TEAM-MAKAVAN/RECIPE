import mongoose from "mongoose";

const { Schema } = mongoose;

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [
      {
        
        name: { type: String, required: false },
        quantity: { type: String, required: false },
      },
      
    ],
    instructions: { type: String, required: true },
    category:{ type: String ,required:true}, // -- for integration of AI
    cookingTime: { type: Number },
    difficulty: { type: String },
    cuisineType: { type: String },
    dietaryRestrictions: [String],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    imageUrl: { type: String },
    videoUrl: { type: String },
  },
  { timestamps: true }
);


const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
