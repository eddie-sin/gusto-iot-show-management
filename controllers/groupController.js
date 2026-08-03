const Group = require("../models/groupModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/groups");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Middleware to handle file uploads for group images
exports.uploadGroupImages = upload.array("image", 5); // Allow up to 5 images

// GET /api/v1/groups
exports.getAllGroups = catchAsync(async (req, res) => {
  const groups = await Group.find();

  res.status(200).json({
    status: "success",
    results: groups.length,
    data: {
      groups,
    },
  });
});

// GET /api/v1/groups/:id
exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    return next(new AppError("No group found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// POST /api/v1/groups
exports.createGroup = catchAsync(async (req, res, next) => {
  // Handle file upload for group image
  if (!req.files || !req.files.image) {
    return next(new AppError("Please upload a group image", 400));
  }

  const photos = req.files.map((file) => ({
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
  }));

  const group = await Group.create(
    {
      title: req.body.title,

      groupNumber: req.body.groupNumber,

      members: Array.isArray(req.body.members)
        ? req.body.members
        : [req.body.members],

      description: req.body.description,

      photos: photos,
    },
    { new: true, runValidators: true },
  );

  if (!group) {
    return next(new AppError("Failed to create group", 500));
  }

  res.status(201).json({
    status: "success",
    data: {
      group,
    },
  });
});

// PATCH /api/v1/groups/:id
exports.updateGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!group) {
    return next(new AppError("No group found with that ID", 404));
  }

  // Update text fields
  const allowedFields = ["title", "groupNumber", "description"];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      group[field] = req.body[field];
    }
  });

  // Update members
  if (req.body.members) {
    group.members = Array.isArray(req.body.members)
      ? req.body.members
      : [req.body.members];
  }

  // Add new photos if uploaded
  if (req.files && req.files.length > 0) {
    const newPhotos = req.files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    }));
    group.photos.push(...newPhotos);
  }
  
  await group.save();

  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// DELETE /api/v1/groups/:id
exports.deleteGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndDelete(req.params.id);

  if (!group) {
    return next(new AppError("No group found with that ID", 404));
  }

  // Delete associated photos from the server
  deletePhotos(group.photos);

  // Delete database record
  await group.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
