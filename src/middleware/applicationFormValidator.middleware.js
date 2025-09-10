import { body, validationResult } from "express-validator";
import { error } from "winston";

const applicationFormValidation = [
  body("applicant_name")
    .trim()
    .notEmpty()
    .withMessage("Applicant name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email formate")
    .normalizeEmail()
    .customSanitizer((email) => email.toLowerCase()),
  body("phone_number")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10 })
    .withMessage("Phone number atlist have 10 charecters"),
  body("education").notEmpty().withMessage("Education can not be empty"),
  body("experience")
    .notEmpty()
    .withMessage(
      "Experince can not be empty If you have no experience write 'fresher'"
    ),
  body("current_location")
    .trim()
    .notEmpty()
    .withMessage("Current location is required"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        sucess: false,
        message: "Validation error",
        error: errors.array().mapped((error) => ({
          param: error.param,
          message: error.msg,
          location: error.location,
        })),
      });
    }
    next();
  },
];

export default applicationFormValidation;
