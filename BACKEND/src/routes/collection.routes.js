// all the routes related to collections  --vansh

import express from "express";
const app = express();


app.use(express.json());
import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {addCollection,
  getCollection,
  getCollections,
  deleteCollection,
  updateCollection
} from "../controllers/collectionController.js"
const collectionRouter=Router();

collectionRouter.route('/add-collection').post(verifyJWT,addCollection);
collectionRouter.route('/get-collection').get(getCollection)
collectionRouter.route('/get-Allcollections').get(getCollections)
collectionRouter.route('/delete-Collection').post(deleteCollection)
collectionRouter.route('/update-collection').post(updateCollection)

export {collectionRouter}
