const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/* ==========================================
   HELPER FUNCTIONS
========================================== */

const filterObj = (obj, ...allowedFields) => {
  const filteredObject = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) filteredObject[key] = obj[key];
  });
  return filteredObject;
};

const findManager = async (id) => {
  const manager = await User.findById(id);
  if (!manager) {
    throw new AppError("No user found with that ID", 404);
  }
  if (manager.role !== "MANAGER") {
    throw new AppError("Only manager accounts can be changed through this route", 403);
  }
  return manager;
};

/* ==========================================
   ADMIN USER MANAGEMENT
========================================== */

// GET /api/v1/users — List accounts. Password fields remain excluded by the model.
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

//GET /api/v1/users/:id — Get a single user. Password fields remain excluded by the model.
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

// PATCH /api/v1/users/:id — Update only a manager's name or email.
exports.updateManager = catchAsync(async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("Use the dedicated password route to change a manager password", 400),
    );
  }

  const manager = await findManager(req.params.id);

  const allowedData = filterObj(req.body, "fullName", "email");
  if (Object.keys(allowedData).length === 0) {
    return next(new AppError("Only fullName and email can be updated here", 400));
  }

  if (allowedData.email && allowedData.email !== manager.email) {
    const emailExists = await User.findOne({ email: allowedData.email });
    if (emailExists) {
      return next(new AppError("Email already in use by another account", 400));
    }
  }

  if (allowedData.fullName) manager.fullName = allowedData.fullName;
  if (allowedData.email) manager.email = allowedData.email;
  await manager.save({ validateModifiedOnly: true });

  res.status(200).json({ status: "success", data: { user: manager } });
});

// PATCH /api/v1/users/:id/password — Admin resets a manager password.
exports.updateManagerPassword = catchAsync(async (req, res) => {
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm) {
    return next(new AppError("Please provide password and passwordConfirm", 400));
  }
  if (password !== passwordConfirm) {
    return next(new AppError("Password and password confirmation do not match", 400));
  }

  const manager = await findManager(req.params.id);

  manager.password = password;
  await manager.save();
  manager.password = undefined;

  res.status(200).json({
    status: "success",
    message: "Manager password updated. The manager must log in again.",
    data: { user: manager },
  });
});

// PATCH /api/v1/users/:id/status — Suspend, disable, or reactivate a manager.
exports.updateManagerStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["ACTIVE", "SUSPENDED", "DISABLED"];

  if (!allowedStatuses.includes(status)) {
    return next(new AppError("Status must be ACTIVE, SUSPENDED, or DISABLED", 400));
  }

  const manager = await findManager(req.params.id);

  manager.status = status;
  // A suspended, disabled, or reactivated manager must obtain a new token.
  manager.sessionInvalidatedAt = new Date(Date.now() - 1000);
  await manager.save({ validateModifiedOnly: true });

  res.status(200).json({ status: "success", data: { user: manager } });
});

// DELETE /api/v1/users/:id — Permanently delete a manager account.
exports.deleteManager = catchAsync(async (req, res) => {
  const manager = await findManager(req.params.id);

  await manager.deleteOne();

  res.status(204).json({ status: "success", data: null });
});