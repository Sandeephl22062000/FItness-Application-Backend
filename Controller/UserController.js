const User = require("../Model/UserModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAync");
const AppError = require("../Error-Handling/error");
const bcrypt = require("bcrypt");
const axios = require("axios");
require("dotenv").config();

const registerUser = catchAsync(async (req, res, next) => {
  if (req.body.googleAccessToken) {
    accessToken = req.body.googleAccessToken;
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const name = response.data.name;
    const email = response.data.email;
    const photo = response.data.picture;

    const userFind = await User.find({ email });
    if (userFind.length === 0) {
      const user = await User.create({
        name,
        email,
        photo,
      });
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      if (user) {
        res.json({
          message: "Successfully register",
          data: user,
          token,
        });
      } else {
        return next(new AppError("Something went wrong", 500));
      }
    }
    const token = jwt.sign({ id: userFind[0]._id }, process.env.SECRET_KEY);
    if (userFind) {
      res.json({
        message: "Successfully logged In",
        id: userFind[0]._id,
        token,
      });
    } else {
      return next(new AppError("Something went wrong", 500));
    }
  } else {
    const { email, password, name, specialization, experiences, role } =
      req.body;
    if (!email || !password || !name) {
      return next(new AppError("Provide all the Requied Details", 401));
    }

    if (name.split(" ").length > 3) {
      return next(new AppError("Please avoid Spaces", 401));
    }
    if (password.includes(" ") || email.includes(" "))
      return next(new AppError("Please avoid Spaces", 401));

    const userFind = await User.findOne({ email });
    if (userFind) return next(new AppError("This Email is already registered"));

    const HashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: HashedPassword,
      photo: req.body.photo,
      role,
      specialization,
      experiences,
    });

    if (user) {
      res.json({
        message: "Successfully register",
      });
    } else {
      return next(new AppError("Something went wrong", 500));
    }
  }
});

const getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find().populate("posts");
  if (!users) return next(new AppError("No User to Display", 404));
  if (users) {
    res.json({
      message: "Successfully register",
      data: users,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const searchusersWithKeyword = catchAsync(async (req, res, next) => {
  const keyword = req.params.search
    ? {
        $or: [
          { name: { $regex: req.params.search, $options: "i" } },
          { email: { $regex: req.params.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword);
  const usersExists = users.filter((user) => user.role === 0);
  if (usersExists) {
    res.json({
      message: "Success",
      data: usersExists,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

const updateuserDetail = catchAsync(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { email, name, specialization, experiences } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        email,
        name,
        specialization,
        experiences,
      },
      {
        new: true,
      }
    );
    if (user) {
      res.status(200).json({
        message: "Details Updated",
      });
    }
  } catch (error) {
    return next(new AppError(error));
  }
});
const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("posts");
  if (user) {
    res.status(201).json({
      message: "Succes",
      data: user,
    });
  } else {
    return next(new AppError("No User Found"));
  }
});

const loginUser = catchAsync(async (req, res, next) => {
  if (req.body.googleAccessToken) {
    accessToken = req.body.googleAccessToken;
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const email = response.data.email;
    const UserInfo = await User.findOne({ email });
    if (!UserInfo) return next(new AppError("Please Register First", 401));

    const token = jwt.sign({ id: UserInfo._id }, process.env.SECRET_KEY);
    if (UserInfo) {
      res.json({
        message: "Successfully login",
        data: UserInfo._id,
        token,
      });
    } else {
      return next(new AppError("Something went wrong", 500));
    }
  } else {
    try {
      let email = req.body.email;
      let password = req.body.password;
      if (!email || !password) {
        return next(new AppError("Provide email and password both", 401));
      }
      const UserInfo = await User.findOne({ email });
      if (!UserInfo) return next(new AppError("Please Register First", 401));

      const PasswordChecking = await bcrypt.compare(
        password,
        UserInfo.password
      );
      if (!PasswordChecking)
        return next(new AppError("Please provide Correct Password", 401));

      const token = jwt.sign({ id: UserInfo._id }, process.env.SECRET_KEY);
      if (UserInfo) {
        res.json({
          message: "Successfully login",
          data: UserInfo?._id,
          token,
        });
      } else {
        return next(new AppError("Something went wrong", 500));
      }
    } catch (error) {
      console.log(error);
    }
  }
});

const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("+password");
  if (req.body.password === user.password) {
    user.password = req.body.NewPassword;
    console.log(user);
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "Success",
      mssage: "Password changed sunccesfully",
    });
  } else {
    return next(new AppError("password invalid", 404));
  }
});

module.exports = {
  registerUser,
  getAllUser,
  loginUser,
  updatePassword,
  getUserById,
  updateuserDetail,
  searchusersWithKeyword,
};
