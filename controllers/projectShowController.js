const ProjectShow = require("../models/projectShowModel");
const catchAsync = require("../utils/catchAsync");

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
