import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./routes/user.routes.js";
import { recipeRouter } from "./routes/recipe.routes.js";
import { SubsciptionRoutes } from "./routes/subscription.routes.js";
import { LikeRoutes } from "./routes/like.routes.js";
import { commentRoutes } from "./routes/comment.routes.js"
import { authRouter } from "./middlewares/auth.middleware.js"
import { collectionRouter } from "./routes/collection.routes.js";

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));

// // Configure CORS
// app.use(cors({
//   origin: process.env.CORS_ORIGIN, // Set the CORS origin from environment variables
//   credentials: true, // Allow credentials (cookies, authorization headers)
// }));

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parse URL-encoded bodies
app.use(express.static("public")); // Serve static files from 'public' directory
app.use(cookieParser()); // Parse cookies

// Routes setup
app.use('/api/v1/users', router);
app.use('/api/v1/recipe', recipeRouter);
app.use('/api/v1/subscription', SubsciptionRoutes);
app.use('/api/v1/Like', LikeRoutes);
app.use('/api/v1/comment', commentRoutes);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/collection', collectionRouter);

export { app };
