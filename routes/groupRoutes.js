const express = require("express");
const groupController = require("../controllers/groupController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router
  .route("/")
  .get(groupController.getAllGroups)
  .post(groupController.uploadGroupImages, groupController.createGroup);

router
  .route("/:id")
  .get(groupController.getGroup)
  .patch(groupController.uploadGroupImages, groupController.updateGroup)
  .delete(groupController.deleteGroup);

module.exports = router;
