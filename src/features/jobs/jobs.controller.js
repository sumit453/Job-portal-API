import JobsRepository from "./jobs.repository.js";
import ApplicationError from "../../error-handeler/applicationError.js";
import UserRepository from "../users/user.repository.js";

export default class JobsController {
  constructor() {
    this.jobsRepository = new JobsRepository();
    this.userRepository = new UserRepository();
  }

  async addJob(req, res, next) {
    try {
      const userId = req.userId;
      const {
        job_title,
        company_name,
        about_company,
        job_discription,
        salary,
        location,
      } = req.body;

      const user = await this.userRepository.findUserInfo(userId);
      if (!user) {
        console.error("addJob error is: ", err.message);
        return res.status(401).send("You are not authorized to add a new job");
      }
      if (user.userType !== "recruiter") {
        return res.status(401).send("You are not authorized to add a new job");
      }
      const newJob = {
        job_title: job_title,
        company_name: company_name,
        about_company: about_company,
        job_discription: job_discription,
        salary: salary,
        location: location,
        addedBy: userId,
      };
      const job = await this.jobsRepository.addJobRepo(newJob);
      return res.status(200).send(job);
    } catch (err) {
      next(err);
    }
  }

  async showAllJob(req, res, next) {
    try {
      const jobs = await this.jobsRepository.showAllJobsRepo();
      if (!jobs) {
        return res, status(404).send("No job is listed");
      }
      return res.status(200).send(jobs);
    } catch (err) {
      next(err);
    }
  }

  async deleteAJob(req, res, next) {
    try {
      const userId = req.userId;
      const jobId = req.params.jobId;
      const user = await this.userRepository.findUserInfo(userId);
      if (!user) {
        return res.status(401).send("You are not authorized to delete a job");
      }
      if (user.addedBy !== "recruiter") {
        return res.status(401).send("You are not authorized to delete a job");
      }

      await this.jobsRepository.deleteAJobRepo(jobId, userId);
      return res.status(200).send("Job is successfuly deleted");
    } catch (err) {
      next(err);
    }
  }
}
