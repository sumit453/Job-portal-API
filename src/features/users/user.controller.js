import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import TokenService from "../services/token.services.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signup(req, res, next) {
    try {
      const { name, email, password, userType } = req.body;
      const profilePicture = req.file.filename;

      // validate original password before hashing
      const passwordFormal =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

      if (!passwordFormal.test(password)) {
        return res
          .status(400)
          .send(
            "Password must be 8-20 characters with: 1 uppercase, 1 lowercase, 1 digit, and 1 special character (@$!%*?&)"
          );
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = {
        name: name,
        email: email,
        password: hashedPassword,
        userType: userType,
        profilePicture: profilePicture,
      };
      const data = await this.userRepository.singUpRepo(newUser);
      const filteredData = {
        name: data.name,
        email: data.email,
        profilePicture: data.profilePicture,
        userType: data.userType,
      };
      return res.status(200).send(filteredData);
    } catch (err) {
      next(err);
    }
  }

  async signin(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await this.userRepository.findUserRepo(email);
      const result = bcrypt.compare(password, user.password);
      if (!result) {
        return res.status(404).send("Invalid credentials");
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          tokenVersion: user.tokenVersion,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
      );

      return res.status(200).send(token);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res.status(404).send("No token provided");
      }
      await TokenService.BlacklistToken(token);
      return res.status(200).send("Token is successfully blacklisted");
    } catch (err) {
      next(err);
    }
  }

  async logoutFromAllDevice(req, res, next) {
    try {
      const userId = req.userId;
      await this.userRepository.tokenValidationIncrease(userId);
      return res.status(200).send("User is loged out from all the devices");
    } catch (err) {
      next(err);
    }
  }
}
