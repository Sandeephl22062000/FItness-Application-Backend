const mongoose = require("mongoose");
const AppError = require("../Error-Handling/error");

const connectDB = (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_DB_URL);
    console.log("DB connected");
  } catch (error) {
    return next(new AppError("Db Not connected"));
  }
};
module.exports = { connectDB };
  