const express = require("express");
const { protectingRoutes } = require("../Controller/authController");
const RequestController = require("../Controller/requestController");
const router = express.Router();
router.post(
  "/getclientsrequest",
  protectingRoutes,
  RequestController.createClientsRequest
);

router.get(
  "/getclientsrequest",
  protectingRoutes,
  RequestController.getClients
);

module.exports = router;
