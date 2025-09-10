import express from "express";
import ApplicationController from "./application.controller";
import applicationFormValidation from "../../middleware/applicationFormValidator.middleware.js";

const applicationRoutes = express.Router();

applicationRoutes.push(
  "/:jobId",
  applicationFormValidation,
  (req, res, next) => {
    ApplicationController.applyForJob(req, res, next);
  }
);

export default applicationRoutes;
