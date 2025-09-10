import UserRepository from "../users/user.repository.js";
import JobsRepository from "../jobs/jobs.repository.js";
import ApplicationError from "../../error-handeler/applicationError.js";
import ApplicationRepository from "./application.repository.js";

export default class ApplicationController {
  constructor() {
    this.userRepository = new UserRepository();
    this.jobsRepository = new JobsRepository();
    this.applicationRepository = new ApplicationRepository();
  }
  async applyForJob(req, res, next) {
    try {
      const userId = req.userId;
      const jobId = req.params.jobId;
      const {
        applicant_name,
        email,
        phone_number,
        skills,
        education,
        experience,
        current_location,
      } = req.body;
      const resume = req.file.fileName;
      const user = await this.userRepository.findUserInfo(userId);
      const job = await this.jobsRepository.findASingleJob(jobId);
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      if (!job) {
        throw new ApplicationError("Job is not found", 404);
      }

      if (user.userType != "job seeker") {
        return res
          .status(401)
          .send("With a recruiter account you can not apply for a job");
      }
      const applicantDetails = {
        applicant_name: applicant_name,
        email: email,
        phone_number: phone_number,
        skills: skills,
        education: education,
        experience: experience,
        current_location: current_location,
        resume: resume,
      };

      const application = await this.applicationRepository.applyForJobRepo(
        applicantDetails,
        user,
        job
      );
      const filteredApplication = {
        name: application.applicant_name,
        email: application.email,
      };
      return res.status(200).send(filteredApplication);
    } catch (err) {
      next(err);
    }
  }
}
