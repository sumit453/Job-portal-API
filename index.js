import "./env.js";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectUsingMongoose from "./src/config/mongoose.config.js";
import userRouts from "./src/features/users/user.routes.js";
import jobRoutes from "./src/features/jobs/jobs.routes.js";
import jwtAuth from "./src/middleware/jwtAuth.middleware.js";
import errorHandlingMiddleware from "./src/middleware/errorHandling.middleware.js";
import applicationRoutes from "./src/features/application/application.routes.js";
import loggerMiddleware from "./src/middleware/logs/logs.middleware.js";

const server = express();

server.use(helmet());

server.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
  })
);

server.use(express.json());
server.use(loggerMiddleware);

server.use("/api/users", userRouts);
server.use("/api/jobs", jwtAuth, jobRoutes);
server.use("/api/apply/", jwtAuth, applicationRoutes);

server.get("/", (req, res) => {
  return res.status(200).send("This is my job portel app");
});

server.use(errorHandlingMiddleware);

server.listen(9000, () => {
  console.log("server is listening on 9000");
  connectUsingMongoose();
});
