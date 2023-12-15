const express = require('express')
const router = express.Router()

const authController = require('../controllers/user.controller')
const authenticateUser = require('../middleware/authenticate')
const upload = require("../middleware/upload")

router.post('/register', authenticateUser, upload.single('profilePicture'), authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/logout', authenticateUser, authController.logoutUser)
router.post('/users', authenticateUser, authController.getAllUsers);
router.post('/delete-user', authenticateUser, authController.deleteUser);

module.exports = router