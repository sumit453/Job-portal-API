import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "User name is required"] },
  email: {
    type: String,
    unique: [true, "Email should be unique"],
    required: [true, "Email is required"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email",
    ],
  },
  password: { type: String, required: [true, "Password is required"] },
  profilePicture: { type: String, default: "" },
  userType: {
    type: String,
    required: [true, "User type is required"],
    enum: ["recruiter", "job seeker"],
  },
  appliedJob: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  tokenVersion: { type: Number, default: 0 },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
