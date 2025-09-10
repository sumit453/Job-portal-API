import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: [true, "Token is required"], unique: true },
  expiredAt: {
    type: Date,
    required: [true, "Expire date is required"],
    index: { expires: 0 },
  },
});

const blacklistTokenModel = mongoose.model("BlacklistToken", blacklistSchema);
export default blacklistTokenModel;
