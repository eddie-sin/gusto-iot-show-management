const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

// GET /api/v1/users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
// POST /api/v1/users
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});
