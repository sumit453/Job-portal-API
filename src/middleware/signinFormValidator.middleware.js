import { body, validationResult } from "express-validator";

const signinFormValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email format")
    .normalizeEmail()
    .customSanitizer((email) => email.toLowerCase()),
  body("password").trim().notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        sucess: false,
        message: "validation is failed",
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

export default signinFormValidator;
