const Category = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// GET /api/v1/categories
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: {
      categories,
    },
  });
});

// GET /api/v1/categories/:id
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

// POST /api/v1/categories
exports.createCategory = catchAsync(async (req, res, next) => {
  const existingCategory = await Category.findOne({
    name: req.body.name,
  });

  if (existingCategory) {
    return next(new AppError("Category with this name already exists", 400));
  }

  const category = await Category.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});

// PATCH /api/v1/categories/:id
exports.updateCategory = catchAsync(async (req, res, next) => {

  if (req.body.name) {
    const existingCategory = await Category.findOne({
      name: req.body.name,
      _id: { $ne: req.params.id }, // Exclude the current category from the search
    });

    if (existingCategory && existingCategory._id.toString() !== req.params.id) {
      return next(new AppError("Category with this name already exists", 400));
    }
  }

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

// DELETE /api/v1/categories/:id
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
