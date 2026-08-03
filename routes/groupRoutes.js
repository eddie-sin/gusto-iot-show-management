const express = require("express");
const groupController = require("../controllers/groupController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router
  .route("/")
  .get(groupController.getAllGroups)
  .post(upload.array("photos", 5), groupController.createGroup);

router
  .route("/:id")
  .get(groupController.getGroup)
  .patch(upload.array("photos", 5), groupController.updateGroup)
  .delete(groupController.deleteGroup);

module.exports = router;
