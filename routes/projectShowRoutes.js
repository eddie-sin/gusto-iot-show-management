const express = require("express");
const projectShowController = require("../controllers/projectShowController");

const router = express.Router();

router
  .route("/")
  .get(projectShowController.getAllProjectShows)
  .post(projectShowController.createProjectShow);

router
  .route("/:id")
  .get(projectShowController.getProjectShow)
  .patch(projectShowController.updateProjectShow)
  .delete(projectShowController.deleteProjectShow);

module.exports = router;