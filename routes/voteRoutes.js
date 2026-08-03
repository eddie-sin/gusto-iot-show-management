const express = require("express");
const voteController = require("../controllers/voteController");

const router = express.Router();

router
  .route("/")
  .get(voteController.getAllVotes)
  .post(voteController.createVote);

module.exports = router;
