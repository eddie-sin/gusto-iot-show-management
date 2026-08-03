const Vote = require("../models/voteModel");
const Group = require("../models/groupModel");
const Category = require("../models/categoryModel");
const ProjectShow = require("../models/projectShowModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// GET /api/v1/votes
exports.getAllVotes = catchAsync(async (req, res, next) => {
  const votes = await Vote.find()
    .populate("projectShowID", "title")
    .populate("groupID", "name")
    .populate("categoryID", "name");

  res.status(200).json({
    status: "success",
    results: votes.length,
    data: {
      votes,
    },
  });
});

// POST /api/v1/votes
exports.createVote = catchAsync(async (req, res, next) => {
  const vote = await Vote.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      vote,
    },
  });
});
