const AppError = require("../Error-Handling/error");
const CalorieTracker = require("../Model/TrackCalorie");
const catchAsync = require("../utils/catchAync");

const saveTrackedCalories = catchAsync(async (req, res, next) => {
  const { items, sumCalorie, sumFat, sumCarbs, sumProtein, name } = req.body;

  const data = await CalorieTracker.create({
    name,
    items,
    sumCalorie,
    sumCarbs,
    sumProtein,
    sumFat,
    user: req.user._id,
  });

  if (data) {
    res
      .status(200)
      .json({ data: data, message: "Food item saved successfully" });
  } else {
    return next(new AppError("Something went wrong", 501));
  }
});

const getCaloriesRecordByID = catchAsync(async (req, res, next) => {
  const data = await CalorieTracker.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  if (data.length > 0) {
    res.status(200).json({ message: "success", data });
  } else {
    return next(new AppError("Something went wrong", 501));
  }
});

const deleteTracekedMeal = catchAsync(async (req, res, next) => {
  const data = await CalorieTracker.findByIdAndDelete(req.params.mealID);
  res.status(200).json({ message: "success" });
});

module.exports = {
  saveTrackedCalories,
  getCaloriesRecordByID,
  deleteTracekedMeal,
};
