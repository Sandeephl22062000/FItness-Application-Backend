const mongoose = require("mongoose");

const clientsRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    charges: {
      type: "string",
      required: "true",
    },
  },
  { timestamps: true },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const ClientsRequest = mongoose.model("Clients", clientsRequestSchema);

module.exports = ClientsRequest;
