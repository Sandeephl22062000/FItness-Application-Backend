const AppError = require("../Error-Handling/error");
const ExtraReview = require("../Model/ExtraReviewModel");
const createReview = async (req, res, next) => {
  try {
    const review = await ExtraReview.create({
      email: req.body.email,
      reviews: req.body.reviews,
    });
    if (review) {
      res.status(201).json({
        message: "success",
        review,
      });
    } else {
      return next(new AppError("Reviews Not created", 404));
    }
  } catch (error) {
    return next(new AppError("Something went wrong", 404));
  }
};
module.exports = { createReview };
