const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const managerFields = "fullName email status";
const managerDetailFields = "fullName email status createdAt";

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
    throw new AppError("No manager found with that ID", 404);
  }
  if (manager.role !== "MANAGER") {
    throw new AppError("Only manager accounts can be changed through this route", 403);
  }
  return manager;
};

// GET /api/v1/users
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({ role: "MANAGER" })
    .select(managerFields)
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

// GET /api/v1/users/:id
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id, role: "MANAGER" }).select(
    managerDetailFields,
  );

  if (!user) {
    return next(new AppError("No manager found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

// POST /api/v1/users
exports.createManager = catchAsync(async (req, res, next) => {
  const { fullName, email, password, passwordConfirm } = req.body;

  if (!fullName || !email || !password || !passwordConfirm) {
    return next(
      new AppError(
        "Please provide fullName, email, password, and passwordConfirm",
        400,
      ),
    );
  }

  if (password !== passwordConfirm) {
    return next(new AppError("Password and password confirmation do not match", 400));
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return next(new AppError("Email already in use by another account", 400));
  }

  const manager = await User.create({
    fullName,
    email: normalizedEmail,
    password,
    role: "MANAGER",
    status: "ACTIVE",
  });

  manager.password = undefined;
  res.status(201).json({ status: "success", data: { user: manager } });
});

// PATCH /api/v1/users/:id
exports.updateManager = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "Use the dedicated password route to change a manager password",
        400,
      ),
    );
  }

  const manager = await findManager(req.params.id);
  const allowedData = filterObj(req.body, "fullName", "email", "status");

  if (Object.keys(allowedData).length === 0) {
    return next(
      new AppError("Only fullName, email, and status can be updated here", 400),
    );
  }

  if (allowedData.email) {
    allowedData.email = allowedData.email.toLowerCase().trim();
    if (allowedData.email !== manager.email) {
      const emailExists = await User.findOne({ email: allowedData.email });
      if (emailExists) {
        return next(new AppError("Email already in use by another account", 400));
      }
    }
  }

  Object.assign(manager, allowedData);
  await manager.save({ validateModifiedOnly: true });

  res.status(200).json({ status: "success", data: { user: manager } });
});

// PATCH /api/v1/users/:id/password
exports.updateManagerPassword = catchAsync(async (req, res, next) => {
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

// PATCH /api/v1/users/:id/status
exports.updateManagerStatus = catchAsync(async (req, res, next) => {
  const allowedStatuses = ["ACTIVE", "SUSPENDED", "DISABLED"];
  if (!allowedStatuses.includes(req.body.status)) {
    return next(new AppError("Status must be ACTIVE, SUSPENDED, or DISABLED", 400));
  }

  const manager = await findManager(req.params.id);
  manager.status = req.body.status;
  await manager.save();

  res.status(200).json({ status: "success", data: { user: manager } });
});

// DELETE /api/v1/users/:id
exports.deleteManager = catchAsync(async (req, res, next) => {
  const manager = await findManager(req.params.id);
  await manager.deleteOne();
  res.status(204).json({ status: "success", data: null });
});
