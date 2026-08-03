const express = require("express");

const authController = require("../controllers/authControllers");
const adminUserController = require("../controllers/adminUserController");

const router = express.Router();

// Every user-management route belongs exclusively to the Academic Head admin.
router.use(authController.protect, authController.restrictTo("ADMIN"));

router
  .route("/")
  .get(adminUserController.getAllUsers)
  .post(authController.createManager);

router
  .route("/:id")
  .get(adminUserController.getUser)
  .patch(adminUserController.updateManager)
  .delete(adminUserController.deleteManager);

module.exports = router;
