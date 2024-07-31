const mongoose = require("mongoose");

const TargetNutrients = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requireCalories: {
      type: String,
      required: true,
    },
    requireProtein: {
      type: String,
      required: true,
    },
    requireCarbs: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Request = mongoose.model("TargetNutrients", TargetNutrients);

module.exports = Request;
