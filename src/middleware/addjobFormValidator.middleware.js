import { body, validationResult } from "express-validator";

const addJobValidation = [
  body("job_title").trim().notEmpty().withMessage("Job title is required"),
  body("company_name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required"),
  body("job_discription")
    .trim()
    .notEmpty()
    .withMessage("Job discription is required"),
  body("salary").trim().notEmpty().withMessage("Salary is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        sucess: false,
        message: "Validation is failed",
        error: errors.array().mapped((error) => ({
          param: error.param,
          error: error.msg,
          location: error.location,
        })),
      });
    }

    next();
  },
];

export default addJobValidation;
