import mongoose from "mongoose";
import ApplicationError from "../../error-handeler/applicationError.js";
import applicationModel from "./application.schema.js";
import EmailServiceNotification from "../services/notification.mail.js";

export default class ApplicationRepository {
  async applyForJobRepo(applicantDetails, user, job) {
    try {
      const newApplication = new applicationModel({
        applicant_name: applicantDetails.applicant_name,
        email: applicantDetails.email,
        phone_number: applicantDetails.phone_number,
        skills: applicantDetails.skills,
        education: applicantDetails.education,
        experience: applicantDetails.experience,
        current_location: applicantDetails.current_location,
        resume: applicantDetails.resume,
      });
      const application = await newApplication.save();

      user.appliedJob.push(job._id);
      await user.save();

      job.appliedFor.push(user._id);
      await job.save();

      const job_name = job.job_title;
      const company_name = job.company_name;
      const name = user.name;
      const email = user.email;

      //send email notification to the user
      await EmailServiceNotification.sendNotification(
        name,
        email,
        job_name,
        company_name
      );
      return application;
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        console.error(
          "Apply for a job mongoose validation error is: ",
          err.message
        );
        throw err;
      }
      console.error("Apply for a job error is: ", err.message);
      throw new ApplicationError(
        "An error occurs during apply for the job",
        500
      );
    }
  }
}
