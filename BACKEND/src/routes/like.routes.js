import express from "express";
const app = express();

app.use(express.json());
import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
// import { Like } from "../models/Like.js";
import { addLike, getLikes } from "../controllers/likeController.js";

const LikeRoutes=Router()

LikeRoutes.route('/addLikes')
 .post(verifyJWT, addLike);


LikeRoutes.route('/getLikes')
 .post(verifyJWT, getLikes);

 
 
export {LikeRoutes}