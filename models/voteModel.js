const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    sessionID: {
      type: String,
      trim: true,
      required: [true, "A vote must have a session ID"],
      unique: true,
    },

    projectShowID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectShow",
        required: [true, "A vote must be associated with a project show"],
      },
    ],

    groupID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: [true, "A vote must be associated with a group"],
      },
    ],

    categoryID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "A vote must be associated with a category"],
      },
    ],
  },
  {
    timestamps: true,
    collection: "votes",
  },
);

voteSchema.index({ sessionID: 1, projectShowID: 1, groupID: 1, categoryID: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;
