const mongoose = require("mongoose");

const votingCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A voting category must have a name"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "A voting category must have a description"],
      trim: true,
    },
  },
  { _id: true },
);

const projectShowSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
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

    location: {
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
    },

    votingCategories: {
      type: [votingCategorySchema],
      default: [],
    },
  },
  { _id: true },
);

const projectSchema = new mongoose.Schema(
  {
    batch: {
      type: String,
      required: [true, "A project must have a batch"],
      trim: true,
      uppercase: true,
      match: [/^HND-\d+$/, "Batch must follow the format HND-57"],
    },

    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A project must have a project manager"],
    },

    moduleStartDate: {
      type: Date,
      required: [true, "A project must have a module start date"],
    },

    theme: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: {
        values: ["DRAFT", "ACTIVE", "COMPLETED"],
        message: "Status must be DRAFT, ACTIVE, or COMPLETED",
      },
      default: "DRAFT",
      required: true,
    },

    // A project always has one show. Its details can be completed later by the manager.
    projectShow: {
      type: projectShowSchema,
      default: () => ({}),
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "projects",
  },
);

projectSchema.index({ batch: 1 }, { unique: true });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
