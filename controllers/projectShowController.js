const ProjectShow = require("../models/projectShowModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// GET /api/v1/project-shows
exports.getAllProjectShows = catchAsync(async (req, res, next) => {
  const projectShows = await ProjectShow.find();

  res.status(200).json({
    status: "success",
    results: projectShows.length,
    data: {
      projectShows,
    },
  });
});

// GET /api/v1/project-shows/:id
exports.getProjectShow = catchAsync(async (req, res, next) => {
  const projectShow = await ProjectShow.findById(req.params.id);

  if (!projectShow) {
    return next(new AppError("No project show found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      projectShow,
    },
  });
});

// POST /api/v1/project-shows
exports.createProjectShow = catchAsync(async (req, res, next) => {
  const projectShow = await ProjectShow.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      projectShow,
    },
  });
});

// PATCH /api/v1/project-shows/:id
exports.updateProjectShow = catchAsync(async (req, res, next) => {
  const projectShow = await ProjectShow.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!projectShow) {
    return next(new AppError("No project show found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      projectShow,
    },
  });
});

// DELETE /api/v1/project-shows/:id
exports.deleteProjectShow = catchAsync(async (req, res, next) => {
  const projectShow = await ProjectShow.findByIdAndDelete(req.params.id);

  if (!projectShow) {
    return next(new AppError("No project show found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});