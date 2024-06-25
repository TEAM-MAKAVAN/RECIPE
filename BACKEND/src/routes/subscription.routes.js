import express from "express";
const app = express();

app.use(express.json());
import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { Subscription } from "../models/subscription.js";
import { toggleSubscription, getUserChannelSubscribers,getSubscribedChannels } from "../controllers/subscription.controller.js";

const SubsciptionRoutes=Router()

SubsciptionRoutes.route('/toggleSubscription')
 .post(verifyJWT, toggleSubscription);



 SubsciptionRoutes.route('/getUserChannelSubscribers')
 .post(verifyJWT, getUserChannelSubscribers);

 SubsciptionRoutes.route('/getSubscribedChannels')
 .post(verifyJWT, getSubscribedChannels);
  
  
 
export {SubsciptionRoutes}