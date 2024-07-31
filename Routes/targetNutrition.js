const express = require("express");
const { protectingRoutes } = require("../Controller/AuthController");
const router = express.Router();
const DietController = require("../Controller/CalorieController.js/DietController");
router.get(
  "/targetnutritionofuser",
  protectingRoutes,
  DietController.getTargetNutrients
);

module.exports = router;
