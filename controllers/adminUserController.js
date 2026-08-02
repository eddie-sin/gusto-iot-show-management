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

const findManager = async (id, next) => {
  const manager = await User.findById(id);
  if (!manager) {
    next(new AppError("No user found with that ID", 404));
    return null;
  }
  if (manager.role !== "MANAGER") {
    next(new AppError("Only manager accounts can be changed through this route", 403));
    return null;
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

// PATCH /api/v1/users/:id — Update only a manager's name or email.
exports.updateManager = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("Use the dedicated password route to change a manager password", 400),
    );
  }

  const manager = await findManager(req.params.id, next);
  if (!manager) return;

  const allowedData = filterObj(req.body, "fullName", "email");
  if (Object.keys(allowedData).length === 0) {
    return next(new AppError("Only fullName and email can be updated here", 400));
  }

  Object.assign(manager, allowedData);
  await manager.save({ validateModifiedOnly: true });

  res.status(200).json({ status: "success", data: { user: manager } });
});

// PATCH /api/v1/users/:id/password — Admin resets a manager password.
exports.updateManagerPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm) {
    return next(new AppError("Please provide password and passwordConfirm", 400));
  }
  if (password !== passwordConfirm) {
    return next(new AppError("Password and password confirmation do not match", 400));
  }

  const manager = await findManager(req.params.id, next);
  if (!manager) return;

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
exports.updateManagerStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const allowedStatuses = ["ACTIVE", "SUSPENDED", "DISABLED"];

  if (!allowedStatuses.includes(status)) {
    return next(new AppError("Status must be ACTIVE, SUSPENDED, or DISABLED", 400));
  }

  const manager = await findManager(req.params.id, next);
  if (!manager) return;

  manager.status = status;
  // A suspended, disabled, or reactivated manager must obtain a new token.
  manager.sessionInvalidatedAt = new Date(Date.now() - 1000);
  await manager.save({ validateModifiedOnly: true });

  res.status(200).json({ status: "success", data: { user: manager } });
});
