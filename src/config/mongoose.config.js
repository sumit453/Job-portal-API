import mongoose from "mongoose";

const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB using mongoose is connect");
  } catch (err) {
    console.error("Mongoose connection error is: ", err.message);
  }
};

export default connectUsingMongoose;
