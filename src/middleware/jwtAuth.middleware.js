import jwt from "jsonwebtoken";
import TokenService from "../features/services/token.services.js";
import UserRepository from "../features/users/user.repository.js";
import ApplicationError from "../error-handeler/applicationError.js";

const userRepository = new UserRepository();

const jwtAuth = async (req, resizeBy, next) => {
  //1. look for the token
  const token = req.headers["authorization"];

  //2. check for the token availablity
  if (!token) {
    return resizeBy.status(401).send("Unauthorized");
  }

  //3. check the token validation
  try {
    //i. check the token is blacklisted or not
    const blacklist = await TokenService.isBlacklisted(token);
    if (blacklist) {
      console.log("Token is invalid bcz it's blacklisted");
      return resizeBy.status(401).send("Token is invalid");
    }

    //ii. varify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    //iii. check token validation against database
    const user = await userRepository.findUserInfo(payload.userId);

    // iv. check token is valid or not
    if (user.tokenVersion !== payload.tokenVersion) {
      return resizeBy.status(401).send("Token is invalid please login again");
    }

    req.userId = payload.userId;
    console.log(payload);
  } catch (err) {
    console.error("JWT auth error is: ", err.message);
    throw new ApplicationError("Something is wrong with jwtauth", 500);
  }
  next();
};

export default jwtAuth;
