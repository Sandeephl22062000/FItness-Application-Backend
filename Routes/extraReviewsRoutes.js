const express = require("express");
const { createReview } = require("../Controller/extraReviewsController");
const router = express.Router();

router.route("/create").post(createReview);

module.exports = router;
