import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      "Mongo DB connection Success: ",
      connectionInstance.connection.host
    );
  } catch (e) {
    console.log("Mongo DB connection Error by Nur: ", e);
    process.exit(1);
  }
};

export default connectDB;
