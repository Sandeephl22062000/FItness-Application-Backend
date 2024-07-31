const mongoose = require("mongoose");

const CaloriesTrackSchema = new mongoose.Schema(
  {
    name: String,
    items: [
      {
        name: String,
        calories: Number,
        fat: Number,
        carbs: Number,
        protein: Number,
        quantity: Number,
      },
    ],
    sumCalorie: Number,
    sumFat: Number,
    sumCarbs: Number,
    sumProtein: Number,
    user: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CaloriesModel", CaloriesTrackSchema);
