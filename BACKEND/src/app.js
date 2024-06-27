import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"



const app= express()


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  Credential:true
}))




//app.use(express.json({limit:"16kb"}))//Built-in Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))//Built-in Middleware
app.use(cookieParser())//Third-Party Middleware



// routes

import { router } from "./routes/user.routes.js";
import { recipeRouter } from "./routes/recipe.routes.js";
import { SubsciptionRoutes } from "./routes/subscription.routes.js";
import { LikeRoutes } from "./routes/like.routes.js";
import { commentRoutes } from "./routes/comment.routes.js"
import { authRouter } from "./middlewares/auth.middleware.js"
import { collectionRouter } from "./routes/collection.routes.js";

app.use('/api/v1/users', router);
app.use('/api/v1/recipe', recipeRouter);
app.use('/api/v1/subscription', SubsciptionRoutes);
app.use('/api/v1/Like' , LikeRoutes);
app.use('/api/v1/comment' , commentRoutes);
app.use('/api/v1/auth' , authRouter);
app.use('/api/v1/collection', collectionRouter) // --vansh

export {app}