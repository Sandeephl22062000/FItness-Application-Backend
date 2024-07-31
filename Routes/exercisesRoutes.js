const express = require("express");
const {
  fetchExercises,
  exercise,
} = require("../Controller/exerciseController");
const router = express.Router();
router.route("/sortedExercises").get(fetchExercises);
router.route("/").get(exercise);

module.exports = router;
