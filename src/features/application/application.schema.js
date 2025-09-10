import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicant_name: {
    type: String,
    required: [true, "Applicant name is required"],
  },
  email: {
    type: String,
    required: "Email id is required",
    unique: [true, "Email should be unique"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email",
    ],
  },
  phone_number: { type: Number, required: "Phone number us required" },
  skills: {
    type: Array,
    items: { type: String },
    required: [true, "Skills need to be mentions"],
  },
  education: {
    type: Array,
    items: { type: String },
    required: [true, "Education is required"],
  },
  experience: {
    type: Array,
    items: { type: String },
    required: [true, "Experience is required"],
  },
  current_location: {
    type: String,
    required: [true, "Current location is required"],
  },
  resume: { type: String, required: [true, "Resume is required"] },
});

const applicationModel = mongoose.model("Application", applicationSchema);

export default applicationModel;
