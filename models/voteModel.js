const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "A vote must belong to a project"],
    },

    // This is the _id of the embedded projectShow subdocument in Project.
    projectShow: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A vote must be associated with a project show"],
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: [true, "A vote must be associated with a group"],
    },

    votingCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A vote must be associated with a voting category"],
    },

    voterToken: {
      type: String,
      trim: true,
      required: [true, "A vote must have a voter token"],
    },
  },
  {
    timestamps: true,
    collection: "votes",
  },
);

voteSchema.index(
  { projectShow: 1, votingCategory: 1, voterToken: 1 },
  { unique: true },
);

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;
