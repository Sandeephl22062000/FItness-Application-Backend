const express = require("express");
const Trainer = require("../../Model/Trainer/trianerModel");
const User = require("../../Model/UserModel");
const AppError = require("../../Error-Handling/error");
const catchAsync = require("../../utils/catchAync");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const getTrainerById = catchAsync(async (req, res, next) => {
  const trainer = await User.findById({ _id: req.params.id }).populate("posts");
  if (trainer) {
    res.json({
      message: "Successful",
      data: trainer,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const getAlltrainer = catchAsync(async (req, res, next) => {
  const keyword = req.params.trainer
    ? {
        $or: [
          { name: { $regex: req.params.trainer, $options: "i" } },
          { email: { $regex: req.params.trainer, $options: "i" } },
        ],
      }
    : {};

  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;
  const users = await User.find(keyword);
  const trainers = users.filter((user) => user.role === 1);
  const paginatedTrainers = trainers.slice(skip, skip + limit);
  const totalPages = Math.ceil(trainers.length / limit);
  if (paginatedTrainers.length > 0) {
    res.json({
      message: "success",
      data: paginatedTrainers,
      totalPages: totalPages,
      currentPage: page,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const getTrainers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const count = await User.countDocuments({ role: 1 });
  const trainers = await User.find({ role: 1 })
    .skip((page - 1) * limit)
    .limit(limit);
  if (trainers) {
    res.json({
      message: "success",
      data: trainers,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const getTrainerByfilter = async (req, res, next) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const count = await User.countDocuments({ role: 1 });
  const { specialization, experienceLevel } = req.params;
  const trainers = await User.find({
    role: 1,
    specialization,
    experiences: experienceLevel,
  })
    .skip((page - 1) * limit)
    .limit(limit);
  if (trainers.length > 0) {
    res.json({
      message: "success",
      data: trainers,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
};

const virtualTrainer = catchAsync(async (req, res, next) => {
  const contentForSearch = req.body.content;
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `${contentForSearch} for this content give me the shortest reply`,
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );
  res.status(201).json({ message: "status", data: response.data });
});

module.exports = {
  virtualTrainer,
  getAlltrainer,
  getTrainers,
  getTrainerById,
  getTrainerByfilter,
};
