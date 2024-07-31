const axios = require("axios");
const catchAsync = require("../../utils/catchAync");
const Food = require("../../Model/CalorieCountingModel");
const AppError = "../../Error-Handling";
const TargetNutrients = require("../../Model/TargetCalories");

const saveUserDetails = catchAsync(async (req, res, next) => {
  const { weight, height, gender, age, activity } = req.body;

  if (gender.toLowerCase() === "male") {
    bmr = 88.362 + 13.397 * +weight + 4.799 * +height - 5.677 * +age;
  } else {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }
  if (activity.toLowerCase() === "sedentary") {
    activtyFactor = 1.2;
  } else if (activity.toLowerCase() === "light") {
    activtyFactor = 1.375;
  } else if (activity.toLowerCase() === "moderate") {
    activtyFactor = 1.55;
  } else if (activity.toLowerCase() === "veryactive") {
    activtyFactor = 1.725;
  } else if (activity.toLowerCase() === "extraactive") {
    activtyFactor = 1.9;
  }
  const maintenanceCalories = bmr * activtyFactor;
  const maintainceCalory = +maintenanceCalories.toFixed(2);
  const userInfo = await Food.create({
    weight,
    height,
    gender,
    age,
    activity,
    user: req.user?._id,
    requireProtein: null,
    requireCalories: maintainceCalory,
    requireCarbs: null,
  });
  if (maintainceCalory) {
    res.status(201).json({
      message: "Details Submitted",
      data: maintainceCalory,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const calorieCounting = catchAsync((req, res, next) => {
  const { weight, height, age, gender, activityFactors } = req.body;
  let bmr;
  if (gender.toLowerCase() === "male") {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }

  const maintenanceCalories = bmr * activityFactors;

  if (maintenanceCalories) {
    res.status(200).json({
      message: "Success",
      data: maintenanceCalories,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const CaloriesPerFood = catchAsync(async (req, res, next) => {
  const response = await axios.get(
    "https://api.api-ninjas.com/v1/nutrition?query=" + req.params.food,
    {
      headers: {
        "X-Api-Key": process.env.FOOD_API,
      },
    }
  );
  if (response.data[0].calories) {
    res.json({
      message: "Success",
      data: response?.data,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const updatecalories = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const food = await Food.find({ user: userId });
  if (food) {
    res.status(200).json({
      message: "Success",
      data: food,
    });
  } else {
    res.status(500).json({ message: "Server Error" });
  }
});

const updateNutrients = catchAsync(async (req, res, next) => {
  const userId = req?.user?._id;
  const { requireProtein, requireCalories, requireCarbs } = req.body;
  const UserData = await Food.find({ user: userId });

  console.log(UserData);

  const updatedvalue = await Food.findByIdAndUpdate(
    UserData._id,
    {
      requireProtein: requireProtein,
      requireCalories: requireCalories,
      requireCarbs: requireCarbs,
    },
    {
      new: true,
    }
  );

  if (updatedvalue) {
    res.status(201).json({
      updatedvalue,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const targetCalories = catchAsync(async (req, res, next) => {
  const { requireCalories, requireProtein, requireCarbs } = req.body;
  const targetCalories = await TargetNutrients.create({
    user: req?.user?._id,
    requireCalories,
    requireProtein,
    requireCarbs,
  });
  if (targetCalories) {
    res.status(201).json({
      data: targetCalories,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const getTargetNutrients = catchAsync(async (req, res, next) => {
  const targetCalories = await TargetNutrients.find({
    user: req?.user?._id,
  }).sort({ createdAt: -1 });
  if (targetCalories) {
    res.status(201).json({
      data: targetCalories[0],
    });
  } else {
    return next(new AppError("Something went wrong", 404));
  }
});

const getMaintainceCalory = catchAsync(async (req, res, next) => {
  const UserID = req?.user?._id;
  const Data = await Food.find({ user: UserID }).sort({ createdAt: -1 });
  if (getMaintainceCalory.length > 0) {
    res.status(200).json({
      maintainceCalory: Data[0]?.requireCalories,
    });
  } else {
    return next(new AppError("Someting Went wrong", 500));
  }
});

module.exports = {
  calorieCounting,
  CaloriesPerFood,
  saveUserDetails,
  updatecalories,
  updateNutrients,
  getMaintainceCalory,
  targetCalories,
  getTargetNutrients,
};

// For men:
// BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)

// For women:
// BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.330 × age in years)

/** but i want it in 5 meals seperated provide as Breakfast, MorningSnacks, Lunch, EveningSnacks and Dinner give output in json format give me atleast 3 item for each meal in output give me only json data in this format for each meal {Item: 'Oatmeal', Calories: 150, Protein: 6, Carbohydrates: 25},without any extra text,dont mention tis type of line Sure, here's a non-vegetarian diet plan divided into 5 meals as per your requirements */
