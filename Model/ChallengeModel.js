const mongoose = require("mongoose");
const Challenge = mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    receiver: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    challengeName: {
      type: String,
      required: [true, "Provide your Challenge a name"],
    },
    challengeDescription: {
      type: String,
      required: [true, "Provide your challenge a description"],
    },
    challengeRules: {
      type: String,
      required: [true, "Provide rules for your Challenges"],
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
    },
    challengeRules: {
      type: String,
    },
  },

  { timestamps: true },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
module.exports = mongoose.model("Challenge", Challenge);
