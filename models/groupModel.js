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

  photos: [
      {
        filename: String,
        originalName: String,
        mimeType: String,
        size: Number,
        path: String,
      },
    ],

  description: {
    type: String,
    required: [true, "A group must have a description"],
    trim: true,
  },
  },
  {
    timestamps: true,
    collection: "groups",
  },
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
