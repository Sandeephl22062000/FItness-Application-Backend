const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAync");
const User = require("../Model/UserModel");
const AppError = require("../Error-Handling/error");
const protectingRoutes = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ");
  const jwtToken = token[1].toString();
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    if (!token) {
      return next(new AppError("you are Logged Out", 401));
    }
  }
  const verification = jwt.verify(jwtToken, process.env.SECRET_KEY);
  const freshuser = await User.findById(verification.id);
  if (!freshuser) return next(new AppError("you are not Logged in", 401));
  req.user = freshuser;
  next();
});

module.exports = {
  protectingRoutes,
};
