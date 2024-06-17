import dotenv from "dotenv";
import {connectDB,disconnectDB} from "./database/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen( process.env.PORT, () => {
      console.log(`server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection Failed!!!", err);
  });

  const gracefulShutdown = () => {
    disconnectDB()
      .then(() => {
        console.log('Server shutting down');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error during disconnection:', err);
        process.exit(1);
      });
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);