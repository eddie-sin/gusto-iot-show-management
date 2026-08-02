const express = require("express");
const authController = require("../controllers/authControllers");
const adminUserController = require("../controllers/adminUserController");

const router = express.Router();

// Every user-management route belongs exclusively to the Academic Head admin.
router.use(authController.protect, authController.restrictTo("ADMIN"));

router.route("/").get(adminUserController.getAllUsers).post(authController.signup);

router.route("/:id").patch(adminUserController.updateManager);
router.route("/:id/password").patch(adminUserController.updateManagerPassword);
router.route("/:id/status").patch(adminUserController.updateManagerStatus);

module.exports = router;
