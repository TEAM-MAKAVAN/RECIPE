import mongoose, { Schema } from "mongoose";

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: String, required: true },
      },
    ],
    instructions: { type: String, required: true },
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

export const Recipe=mongoose.model("Recipe",recipeSchema);