import express from "express";
const app = express();

app.use(express.json());
import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
// import { Like } from "../models/Like.js";
import { addComment, getComments} from "../controllers/commentController.js"

const commentRoutes=Router()

commentRoutes.route('/addComment')
 .post(verifyJWT, addComment);


commentRoutes.route('/getComments')
 .post(verifyJWT, getComments);

 
 
export {commentRoutes}