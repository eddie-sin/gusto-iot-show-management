const express = require("express");
const projectShowController = require("../controllers/projectShowController");

const router = express.Router();

router
  .route("/")
  .get(projectShowController.getAllProjectShows)
  .post(projectShowController.createProjectShow);

module.exports = router;
