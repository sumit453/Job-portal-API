import mongoose from "mongoose";
import ApplicationError from "../../error-handeler/applicationError.js";
import jobsModel from "./jobs.schema.js";

export default class JobsRepository {
  async addJobRepo(jobData) {
    try {
      const newJob = new jobsModel(jobData);
      const addedJob = await newJob.save();
      return addedJob;
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        console.error("Add job mongoose validation error is: ", err.message);
        throw err;
      }
      console.error("Add job error is: ", err.message);
      throw new ApplicationError("An error occurred when adding the job", 500);
    }
  }

  async showAllJobsRepo() {
    try {
      const jobs = await jobsModel.find();
      if (!jobs) {
        console.err("No job found");
        throw new ApplicationError("No job found", 404);
      }
      return jobs;
    } catch (err) {
      console.error("Showing all job erro is: ", err.message);
      throw new ApplicationError(
        "An error occurs while showing all the jobs",
        500
      );
    }
  }

  async findASingleJob(jobId) {
    try {
      const job = await jobsModel.findById(new Object(jobId));
      if (!job) {
        console.error("Requested job is not found");
        throw new ApplicationError("Required job is not found", 404);
      }
      return job;
    } catch (err) {
      console.error("Finding a single job error is: ", err.message);
      throw new ApplicationError(
        "Something whent wrong when finding a single job",
        500
      );
    }
  }

  async deleteAJobRepo(jobId, userId) {
    try {
      const deleteJob = await jobsModel.deleteOne({
        _id: new ObjectId(jobId),
        addedBy: new ObjectId(userId),
      });
      if (deleteJob.deletedCount == 0) {
        console.error("Delete job error is: ", err.message);
        throw new ApplicationError("Delete job is not done", 404);
      }
      return deleteJob.deletedCount > 0;
    } catch (err) {
      console.error("Deleteing a job error is: ", err.message);
      throw new ApplicationError("An error occurs while deleting the job", 500);
    }
  }
}
