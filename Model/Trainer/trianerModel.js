const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
// const sendEmail = require("../utils/email");
const TrainerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide Email Address"],
      lowercase: true,
      validate: [validator.isEmail, "Please Provide Valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please provide Password"],
      trim: true,
      minlength: 8,
      maxlength: 30,
      validate: [
        validator.isStrongPassword,
        "Password Must Contain Atleast one upperCase alphabet,Atleast One LowerCase Alphabet,and Atleast 1 Special Character",
      ],
    },
    photo: {
      type: String,
    },

    // Achievements: {
    //   type: String,
    // },
 
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// UserSchema.pre("save", async function (next) {
//   await sendEmail({
//     email: this.email,
//     subject: "Registered",
//     message: `Your Email ID is ${this.email} and your Login Password is ${this.password}`,
//   });
//   next();
// });

TrainerSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  console.log(this.password);
  next();
});

module.exports = mongoose.model("Trainer", TrainerSchema);
