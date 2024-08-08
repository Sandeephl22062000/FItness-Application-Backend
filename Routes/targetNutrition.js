const express = require("express");
const { protectingRoutes } = require("../Controller/authController");
const router = express.Router();
const DietController = require("../Controller/CalorieController.js/dietController");
router.get(
  "/targetnutritionofuser",
  protectingRoutes,
  DietController.getTargetNutrients
);

module.exports = router;
