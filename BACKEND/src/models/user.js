import mongoose, { Schema } from "mongoose";
// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  { 
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    savedRecipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    // now we are making a different schema for following & followers which is subscription schema
    // following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    refreshToken: [{
      type: String,
    }],
    author: [{ type: Schema.Types.ObjectId }],
    isVerified:{ type:Boolean, default:false},
    
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};



userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
     
      
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};



// Temporary User Schema
const temporaryUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: Buffer },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }
);

temporaryUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const TemporaryUser = mongoose.model("TemporaryUser", temporaryUserSchema);

export const User=mongoose.model("User",userSchema);
