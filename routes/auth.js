const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller')
const authenticateUser = require('../middleware/authenticate')

router.post('/register',  authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/logout', authenticateUser, authController.logoutUser)

module.exports = router