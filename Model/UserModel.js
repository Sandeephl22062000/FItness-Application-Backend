const mongoose = require("mongoose");
const validator = require("validator");
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the username"],
    },
    email: {
      type: String,
      required: [true, "Please provide Email Address"],
      lowercase: true,
      validate: [validator.isEmail, "Please Provide Valid Email"],
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate: [
        validator.isStrongPassword,
        "Password Must Contain Atleast one upperCase alphabet,Atleast One LowerCase Alphabet,and Atleast 1 Special Character",
      ],
    },
    photo: {
      type: String,
    },
    role: { type: Number, default: 0 },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    specialization: {
      type: String,
    },
    experiences: {
      type: String,
    },
    fees: {
      type: Number,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
