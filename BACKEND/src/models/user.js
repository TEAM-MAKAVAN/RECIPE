import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  { 
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    savedRecipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
  },
  { timestamps: true }
);

export const User=mongoose.model("User",userSchema);