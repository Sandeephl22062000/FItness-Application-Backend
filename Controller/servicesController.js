const AppError = require("../Error-Handling/error");
const Services = require("../Model/ServicesModel");
const catchAsync = require("../utils/catchAync");
const createServices = catchAsync(async (req, res, next) => {
  try {
    const { service } = req.body;
    console.log(service);
    const newservice = await Services.create({
      trainer: req.user._id,
      duration: service.duration,
      description: service.description,
      charges: service.charges,
    });
    console.log(newservice);
    res.status(201).json({ service: newservice, message: "success" });
  } catch (error) {
    return next(new AppError("Something went wrong", 500));
  }
});

const getServicesOfTrainer = async (req, res, next) => {
  const services = await Services.find({ trainer: req?.params?.trainerID });
  console.log(services);
  res.status(200).json({
    message: "success",
    services,
  });
};

const editServices = catchAsync(async (req, res, next) => {
  const { duration, charges, description } = req.body;
  const updateService = await Services.findByIdAndUpdate(
    req.params.serviceID,
    {
      duration,
      charges,
      description,
    },
    { new: true }
  );
  if (updateService) {
    res.status(200).json({
      message: "success",
      updateService,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const deleteServices = catchAsync(async (req, res, next) => {
  console.log(req.params.serviceID);
  const services = await Services.findByIdAndDelete(req.params.serviceID);
  res.status(200).json({
    message: "success",
  });
});

module.exports = {
  createServices,
  getServicesOfTrainer,
  editServices,
  deleteServices,
};
