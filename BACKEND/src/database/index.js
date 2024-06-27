import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      // `${process.env.MONGODB_URI}/${DB_NAME}`
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\n MongoDb Connected!! DB HOSt:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};


const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (err) {
    console.error('MongoDB disconnection failed:', err);
  }
};


export {connectDB,disconnectDB}
