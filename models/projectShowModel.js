const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A group must have a project title"],
    trim: true,
  },

  groupNumber: {
    type: String,
    required: [true, "A group must have a group number"],
    trim: true,
  },

  members: {
    type: [String],
    required: [true, "A group must have members"],
    validate: {
      validator: function (members) {
        return members.length >= 2;
      },
      message: "A group must have at least 2 members",
    },
  },

  description: {
    type: String,
    required: [true, "A group must have a description"],
    trim: true,
  },
});

const votingCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A voting category must have a name"],
    trim: true,
  },

  question: {
    type: String,
    required: [true, "A voting category must have a question"],
    trim: true,
  },
});

const projectShowSchema = new mongoose.Schema(
  {
    batch: {
      type: String,
      required: [true, "A project show must have a batch"],
      trim: true,
      match: [/^HnD-\d+$/, "Batch must follow the format HnD-57"],
    },

    theme: {
      type: String,
      required: [true, "A project show must have a theme"],
      trim: true,
    },

    date: {
      type: Date,
      default: null,
    },

    place: {
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

    groups: {
      type: [groupSchema],
      default: [],
    },

    votingCategories: {
      type: [votingCategorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "projectShows",
  },
);

const ProjectShow = mongoose.model("ProjectShow", projectShowSchema);

module.exports = ProjectShow;
