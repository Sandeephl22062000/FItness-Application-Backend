const mongoose = require("mongoose");

const ExtraReview = new mongoose.Schema(
  {
    email: { type: String, required: true },
    reviews: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExtraReview", ExtraReview);
