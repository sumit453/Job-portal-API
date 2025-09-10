import { body, param, validationResult } from "express-validator";

const signupFormValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name much be between 2-50 charecters")
    .escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is requirted")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .customSanitizer((email) => email.toLowerCase()),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password much be at lest 8 characters")
    .matches(/[A-z]/)
    .withMessage("Password should have at lest one Upper Case letter")
    .matches(/[1-9]/)
    .withMessage("Password much have atlest one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password atlest have one special charecter"),
  body("userType").trim().notEmpty().withMessage("User type is required"),

  // validation handler
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        sucess: false,
        message: "Validation failed",
        error: errors.array().map((error) => ({
          param: error.param,
          msg: error.msg,
          location: error.location,
        })),
      });
    }
    next();
  },
];

export default signupFormValidation;
