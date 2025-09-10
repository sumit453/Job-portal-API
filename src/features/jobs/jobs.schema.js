import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
  job_title: { type: String, required: [true, "Job title is required"] },
  company_name: { type: String, required: [true, "Company name is required"] },
  about_company: { type: String },
  job_discription: {
    type: String,
    required: [true, "Job description is required"],
  },
  salary: { type: Number, required: [true, "salary is required"] },
  location: { type: String, required: [true, "Location is required"] },
  appliedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const jobsModel = mongoose.model("Job", jobsSchema);
export default jobsModel;
