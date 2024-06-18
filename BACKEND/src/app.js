import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"



const app= express()


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  Credential:true
}))




app.use(express.json({limit:"16kb"}))//Built-in Middleware
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))//Built-in Middleware
app.use(cookieParser())//Third-Party Middleware



// routes

import { router } from "./routes/user.routes.js";
app.use('/api/v1/users', router);

export {app}