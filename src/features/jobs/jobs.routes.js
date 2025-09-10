import express from "express";
import JobsController from "./jobs.controller.js";
import addJobValidation from "../../middleware/addjobFormValidator.middleware.js";

const jobController = new JobsController();

const jobRoutes = express.Router();

jobRoutes.post("/addjob", addJobValidation, (req, res, next) => {
  jobController.addJob(req, res, next);
});

jobRoutes.get("/showalljob", (req, res, next) => {
  jobController.showAllJob(req, res, next);
});

jobRoutes.delete("/deletejob/:jobId", (req, res, next) => {
  jobController.deleteAJob(req, res, next);
});

export default jobRoutes;
