const express = require("express");
const router = express.Router();

const authController = require("../controllers/user.controller");
const authenticateUser = require("../middleware/authenticate");
const { uploadSingleImage, uploadMultipleFiles } = require("../middleware/upload");
const projectController = require("../controllers/project.controller");

router.post(
  "/register",
  authenticateUser,
  uploadSingleImage.single("profilePicture"),
  authController.registerUser
);
router.post("/login", authController.loginUser);
router.post("/logout", authenticateUser, authController.logoutUser);
router.post("/users", authenticateUser, authController.getAllUsers);
router.post("/delete-user", authenticateUser, authController.deleteUser);

router.get("/projects", authenticateUser, projectController.getProjects);
router.post("/add-project", authenticateUser, uploadMultipleFiles.array('documents'), projectController.addProject);
router.put(
  "/update-project",
  authenticateUser,
  projectController.updateProject
);
router.delete(
  "/delete-project",
  authenticateUser,
  projectController.deleteProject
);

module.exports = router;
