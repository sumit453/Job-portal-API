import jws from "jsonwebtoken";
import ApplicationError from "../../error-handeler/applicationError.js";
import blacklistTokenModel from "../../middleware/blacklist.token.schema.middleware.js";

export default class TokenService {
  static async BlacklistToken(token) {
    try {
      // 1. decode the token using jws
      const decode = jws.decode(token);

      // 2. check is this token is valid or is there any token available
      if (!decode || !decode.exp) {
        throw new ApplicationError("Invalid token", 400);
      }

      // 3. check token's expire date
      const expiredAt = new Date(decode.exp * 1000); // converting the expiry time to milisecond

      // 4. add the token to balacklist database
      const blacklist = new blacklistTokenModel({
        token: token,
        expiredAt: expiredAt,
      });

      // 5. save it
      await blacklist.save();

      return true;
    } catch (err) {
      console.error("Token blacklist error is: ", err.message);
      throw new ApplicationError("Token is failed to blacklisted", 500);
    }
  }

  static async isBlacklisted(token) {
    try {
      // 1. Find the token
      const answer = await blacklistTokenModel.findOne({ token: token });
      //2. check if it is there or not
      if (answer) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Token finding error is: ", err.message);
      throw new ApplicationError("Finding token is failed", 500);
    }
  }
}
