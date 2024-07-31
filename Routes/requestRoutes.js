const express = require("express");
const { protectingRoutes } = require("../Controller/AuthController");
const RequestController = require("../Controller/RequestController");
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
