import logger from "./logs/logs.js";
import ApplicationError from "../error-handeler/applicationError.js";
import mongoose from "mongoose";

const loggerError = (err, req) => {
  const sensitive = req.url.includes("signin") || req.url.includes("signup");
  const timeStamp = new Date().toISOString();
  const errorDetails = {
    message: `Error: ${req.method} - ${req.url} - ${timeStamp} - ${err.message}`,
    stack: err.stack,
  };
  if (!sensitive) {
    errorDetails.body = req.body || {};
  }

  logger.error(errorDetails);
};

const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err) return next();

  loggerError(err, req);

  // if it is a mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }

  //if it is a Application Error
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  console.error("Error handling error message is: ", err.message);
  return res.status(500).send("Something went wrong please try again later");
};

export default errorHandlingMiddleware;
