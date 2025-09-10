import mongoose from "mongoose";
import ApplicationError from "../../error-handeler/applicationError.js";
import { ObjectId } from "mongodb";
import userModel from "./user.schema.js";

export default class UserRepository {
  async singUpRepo(userData) {
    try {
      const newUser = new userModel(userData);
      await newUser.save();
      return newUser;
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        console.error("Signup mongoose validation error is: ", err.message);
        throw err;
      } else {
        console.error("Signup error is: ", err.message);
        throw new ApplicationError(
          err.message || "Something is wrong with the database",
          500
        );
      }
    }
  }

  async findUserRepo(email) {
    try {
      const user = userModel.findOne({ email: email });
      if (!user) {
        throw new ApplicationError("Invalid cradential", 404);
      }
      return user;
    } catch (err) {
      console.err("Finding user Error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async findUserInfo(userId) {
    try {
      const user = await userModel.findById(new ObjectId(userId));
      if (!user) {
        throw new ApplicationError("Invalid cradential", 404);
      }
      return user;
    } catch (err) {
      console.error("Finding user info error is: ", err.message);
      throw new ApplicationError("Something is wrong with database", 500);
    }
  }

  async tokenValidationIncrease(userId) {
    try {
      const user = userModel.findByIdAndUpdate(
        new ObjectId(userId),
        { $inc: { tokenVersion: 1 } },
        { new: true }
      );
      return user;
    } catch (err) {
      console.error("Logout from all device error is: ", err.message);
      throw new ApplicationError("Some thing is wrong with database", 500);
    }
  }
}
