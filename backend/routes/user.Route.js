const express = require('express');
const router = express.Router();
const {getUserProfile} = require('../controllers/user.Controller')
const {authMiddleware} = require('../middleware/auth.Middleware')

router.get('/profile', authMiddleware, getUserProfile)

module.exports = router;