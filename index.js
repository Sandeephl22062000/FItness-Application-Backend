const express = require("express");
require("dotenv").config();
const globalErrorHandler = require("./Error-Handling/globalErrorHandler");
const userRoutes = require("./Routes/userRoutes");
const { connectDB } = require("./Database/conn");
const AppError = require("./Error-Handling/error");
const trainerRoutes = require("./Routes/trainerRoute");
const exerciseRoutes = require("./Routes/exercisesRoutes");
const postRoutes = require("./Routes/postRoutes");
const gymRoutes = require("./Routes/gymRoutes");
const requestRoutes = require("./Routes/requestRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const targetNutrientsRoutes = require("./Routes/targetNutrition");
const ExtraReviewRoutes = require("./Routes/extraReviewsRoutes");
const cors = require("cors");
connectDB();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/exercise", exerciseRoutes);
app.use("/api/post", postRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/gyms", gymRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/targetnutrients", targetNutrientsRoutes);
app.use("/api/reviews", ExtraReviewRoutes);

app.all("*", (req, res, next) => {
  return next(
    new AppError(`${req.originalUrl} This URL is not running on this server`)
  );
});

app.use(globalErrorHandler);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server Connected on port: ${process.env.PORT}`);
});
