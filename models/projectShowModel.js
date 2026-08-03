const groupModel = require("./groupModel.js");
const categoryModel = require("./categoryModel.js");

const mongoose = require("mongoose");

const projectShowSchema = new mongoose.Schema(
  {
    batch: {
      type: String,
      required: [true, "A project show must have a batch"],
      trim: true,
      match: [/^HND-\d+$/, "Batch must follow the format HND-57"],
    },

    theme: {
      type: String,
      required: [true, "A project show must have a theme"],
      trim: true,
    },

    moduleStartDate: {
      type: Date,
      default: null,
    },

    projectStartDate: {
      type: Date,
      default: null,
    },

    campus: {
      type: String,
      trim: true,
      default: null,
    },

    floor: {
      type: String,
      trim: true,
      default: null,
    },

    room: {
      type: String,
      trim: true,
      default: null,
    },

    startTime: {
      type: String,
      trim: true,
      default: null,
    },

    endTime: {
      type: String,
      trim: true,
      default: null,
    },

    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
    collection: "projectShows",
  },
);

const ProjectShow = mongoose.model("ProjectShow", projectShowSchema);

module.exports = ProjectShow;
