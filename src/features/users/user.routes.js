import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middleware/jwtAuth.middleware.js";
import signinFormValidator from "../../middleware/signinFormValidator.middleware.js";
import signupFormValidation from "../../middleware/signupFormValidator.middleware.js";
import uploadFile from "../../middleware/fileUpload.middleware.js";

const userControler = new UserController();

const userRouts = express.Router();

userRouts.post(
  "/signup",
  uploadFile.single("profilePicture"),
  signupFormValidation,
  (req, res, next) => {
    userControler.signup(req, res, next);
  }
);

userRouts.post("/signin", signinFormValidator, (req, res, next) => {
  userControler.signin(req, res, next);
});

userRouts.post("/logout", jwtAuth, (req, res, next) => {
  userControler.logout(req, res, next);
});

userRouts.post("/logoutall", jwtAuth, (req, res, next) => {
  userControler.logoutFromAllDevice(req, res, next);
});

export default userRouts;
