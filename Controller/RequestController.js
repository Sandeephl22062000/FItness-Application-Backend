const AppError = require("../Error-Handling/error");
const ClientsRequest = require("../Model/RequestModel");
const catchAsync = require("../utils/catchAync");

const createClientsRequest = catchAsync(async (req, res, next) => {
  const { charges, trainerID } = req.body;
  const saveCharges = +charges / 100;
  const request = await ClientsRequest.create({
    charges: saveCharges,
    trainer: trainerID,
    user: req?.user?._id,
  });
  if (request) {
    res.status(201).json({ message: "success" });
  } else {
    return next(new AppError("Something went wrong", 501));
  }
});

const getClients = catchAsync(async (req, res, next) => {
  const clients = await ClientsRequest.find({
    trainer: req?.user?._id,
  }).populate("user", "name photo");
  if (clients.length > 0) {
    res.status(200).json({
      message: "success",
      clients,
    });
  } else {
    return next(new AppError("Something Went wrong", 501));
  }
});
module.exports = {
  createClientsRequest,
  getClients
};
